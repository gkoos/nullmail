const BLOCKED_ADDRESSES = new Set(['abuse@maildock.store']);

export function isBlockedAddress(address = '') {
  return BLOCKED_ADDRESSES.has(address.toLowerCase());
}
