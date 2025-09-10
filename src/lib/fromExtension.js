export function withFromExtension(url) {
  if (typeof window === 'undefined') return url;
  const params = new URLSearchParams(window.location.search);
  return params.get('fromExtension')
    ? `${url}${url.includes('?') ? '&' : '?'}fromExtension=1`
    : url;
}

export function getExtensionLinkType() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('fromExtension')) return null;

  const ua = navigator.userAgent;
  // Check for mobile devices
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(ua);
  if (isMobile) return null;

  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
    return 'chrome';
  }
  if (ua.includes('Firefox')) {
    return 'firefox';
  }
  return null;
}