import { act, renderHook } from '@testing-library/react';
import { useCvStore } from './useCvStore';
import { createEmptyCv } from '../cv/schema';
import { sampleCv } from '../test/fixtures';

const setup = () => {
  const save = vi.fn(() => true);
  const hook = renderHook(() => useCvStore(sampleCv, save));
  return { ...hook, save };
};

describe('useCvStore', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('commits are undoable; plain updates are not recorded', () => {
    const { result } = setup();
    act(() => result.current.update((cv) => ({ ...cv, declaration: 'typed' })));
    expect(result.current.canUndo).toBe(false);

    act(() => void result.current.commit('Deleted skills', (cv) => ({ ...cv, skills: [] })));
    expect(result.current.data.skills).toEqual([]);
    expect(result.current.canUndo).toBe(true);

    let label: string | null = null;
    act(() => void (label = result.current.undo()));
    expect(label).toBe('Deleted skills');
    expect(result.current.data.skills).toHaveLength(2);
    expect(result.current.data.declaration).toBe('typed');
  });

  it('ignores commits that change nothing, so Undo never reverts something else', () => {
    const { result } = setup();
    let changed = true;
    act(() => void (changed = result.current.commit('Polished wording', (cv) => ({ ...cv }))));
    expect(changed).toBe(false);
    expect(result.current.canUndo).toBe(false);
  });

  it('debounces saving', () => {
    const { result, save } = setup();
    save.mockClear();
    act(() => result.current.update((cv) => ({ ...cv, declaration: 'a' })));
    act(() => result.current.update((cv) => ({ ...cv, declaration: 'ab' })));
    expect(save).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(500));
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenLastCalledWith(expect.objectContaining({ declaration: 'ab' }));
  });

  it('reports when the browser refuses to save', () => {
    const { result } = renderHook(() => useCvStore(createEmptyCv, () => false));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.saveOk).toBe(false);
  });
});
