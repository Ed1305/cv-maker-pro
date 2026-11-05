/** Short unique id for list items. Uses crypto when available. */
export const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 12);
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};
