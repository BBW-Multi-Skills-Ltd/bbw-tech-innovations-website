export function externalUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}
