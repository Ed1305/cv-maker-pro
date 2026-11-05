/**
 * Change handler used by every editor. Pass `undoLabel` for destructive or
 * bulk edits (deleting an item, rewriting text) so the user can undo them.
 */
export type Change<T> = (next: T, undoLabel?: string) => void;

export interface EditorProps<T> {
  value: T;
  onChange: Change<T>;
}

export const moveItem = <T>(list: T[], index: number, direction: -1 | 1): T[] => {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

export const replaceById = <T extends { id: string }>(list: T[], id: string, patch: Partial<T>): T[] =>
  list.map((item) => (item.id === id ? { ...item, ...patch } : item));
