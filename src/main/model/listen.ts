import type {BingSession} from "./bing";
import {createBingSession} from './bing'
import {ipcMain} from 'electron'
import {createLoginWindow} from "../index";

// const sessionList: BingSession[] = []
let session: BingSession

const listen = (mainWindow) => {

  // 监听渲染进程的消息
  ipcMain.handle('startChat', async () => {
    session = await createBingSession()
    session.onMessage((message) => {
      mainWindow.webContents.send('receiveMessage', message)
    })
  })

  // 重置
  ipcMain.handle('resetChat', async () => {
    session.reset().then()
  })

  // 重置
  // @ts-ignore
  ipcMain.handle('changeType', async (e, type) => {
    session.changeType(type)
  })

  // 监听消息
  // @ts-ignore
  ipcMain.handle('sendMessage', async (e, message) => {
    await session.sendMessage(message)
  })

  // 监听缩小，放大，关闭功能
  // @ts-ignore
  ipcMain.handle('windowAction', (e, type) => {
      switch (type) {
          case 'min':mainWindow.minimize();break;
          case 'max':if (mainWindow.isMaximized()) {mainWindow.restore();} else {mainWindow.maximize();}break;
          case 'close':mainWindow.close();break;
          default:break;
      }
  })

  // 打开登录窗口登录
  // @ts-ignore
  ipcMain.handle('createLoginWindow', async (e, data) => {
    createLoginWindow()
  })


}
export default listen
