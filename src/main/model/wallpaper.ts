import axios from 'axios'

export const getWallpaper = async () => {
  const res = await axios.get('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
  const { images } = res.data
  const { url } = images[0]
  return `https://cn.bing.com${url}`
}
