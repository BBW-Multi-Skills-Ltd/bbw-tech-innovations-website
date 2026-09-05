export function canUseProductionPasskeys() {
  return typeof window !== 'undefined'
    && window.location.hostname === 'bbwtechinnovation.com'
    && 'PublicKeyCredential' in window
}
