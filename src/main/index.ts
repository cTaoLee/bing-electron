import { app, BrowserWindow, BrowserView, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import listen from "./model/listen";
import {getWallpaper} from "./model/wallpaper";
import {readerCookiesFromFile, writeCookiesToFile} from "./utils/cookie";
import {loadCookie, getUserInfo} from "./model/bing";


let mainWindow: BrowserWindow
let hiddenWindow: BrowserWindow
let loginView: BrowserView

/**
 * 创建主窗口
 */
const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 730,
    show: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.menuBarVisible = false
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // 获取壁纸
    getWallpaper().then(url => {
      mainWindow.webContents.send('wallpaper', url)
    })

    // 读取cookie
    readerCookiesFromFile('cookie-user.json').then(cookies => {
      if (cookies) {
        loadCookie(JSON.parse(cookies))



        getUserInfo().then(res => {
          mainWindow.webContents.send('userInfo', res)
          readerCookiesFromFile('cookie-bing.json').then(_ => {
            loadCookie(JSON.parse(_))
          })
        })
      }
    })
  })
  mainWindow.webContents.setWindowOpenHandler (handler => {
    shell.openExternal(handler.url);
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export const createLoginWindow = (): void => {
  loginView = new BrowserView()
  mainWindow.setBrowserView(loginView)
  const { width, height } = mainWindow.getBounds()
  loginView.setBounds({ x: 0, y: 30, width, height: height - 30 })
  loginView.webContents.loadURL('https://login.live.com/')
  // @ts-ignore
  loginView.webContents.on('did-navigate', (event, url) => {
    if (url.startsWith('https://account.microsoft.com/')) {
      const session = loginView.webContents.session
      session.cookies.get({}).then((cookies) => {
        writeCookiesToFile(JSON.stringify(cookies), 'cookie-user.json').then()
      })
      createHiddenWindow()
      mainWindow.removeBrowserView(loginView)
    }
  })
}

export const createHiddenWindow = (): void => {
  hiddenWindow = new BrowserWindow({show: false,frame: false, webPreferences: {nodeIntegration: true}})
  hiddenWindow.loadURL('https://cn.bing.com/')
  hiddenWindow.on('ready-to-show', () => {
    const session = hiddenWindow.webContents.session
    session.cookies.get({ domain: '.bing.com' }).then((cookies) => {
      writeCookiesToFile(JSON.stringify(cookies), 'cookie-bing.json').then()
    })
  })

}


// 开始执行
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })


  // 创建主窗口
  createMainWindow()
  // 设置监听
  listen(mainWindow)

})

// MacOS 设置 command + Q 关闭软件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
