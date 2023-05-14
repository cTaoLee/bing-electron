// 获取链接的 域名
export function getDomain(url: string) {
  const domain = url.match(/:\/\/(.[^/]+)/)
  if (domain) {
    return domain[1]
  }
  return ''
}
