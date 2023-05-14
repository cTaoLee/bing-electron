import fs from 'fs'

export const readerCookiesFromFile = async (filePath: string = 'cookie.txt') => {
  // 如果文件不存在
  if (!fs.existsSync(filePath)) {
    return ''
  }
  return fs.readFileSync(filePath, 'utf-8')
}

export const writeCookiesToFile = async (cookies: string, filePath: string = 'cookie.txt') => {
  fs.writeFileSync(filePath, cookies)
}
