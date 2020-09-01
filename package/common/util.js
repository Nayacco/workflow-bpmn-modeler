export function randomStr() {
  return Math.random().toString(36).slice(-8)
}

export function parseCDATA(str) {
  if (str) {
    const tmp = str.replace(/<!\[CDATA\[(.+)\]\]>/, '$1')
    const value = tmp.replace(/&lt;!\[CDATA\[(.+)\]\]&gt;/, '$1')
    return value
  }
  return ''
}
