import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { CVData } from '../cv/schema';
import { loadCv, saveCv } from '../cv/storage';

/**
 * Central CV state.
 *
 * - `update` is for ordinary edits (typing) and is not added to undo history.
 * - `commit` is for destructive or bulk changes (delete, polish, trim, import,
 *   start over). It records a snapshot so the change can be undone. It returns
 *   false — and records nothing — if the change wouldn't alter the CV.
 */

export type Recipe = (data: CVData) => CVData;

const HISTORY_LIMIT = 30;

interface Snapshot {
  data: CVData;
  label: string;
}

export interface CvState {
  data: CVData;
  past: Snapshot[];
}

type Action = { type: 'update'; recipe: Recipe } | { type: 'commit'; next: CVData; label: string } | { type: 'undo' };

export const cvReducer = (state: CvState, action: Action): CvState => {
  switch (action.type) {
    case 'update': {
      const data = action.recipe(state.data);
      return data === state.data ? state : { ...state, data };
    }
    case 'commit':
      return {
        data: action.next,
        past: [...state.past, { data: state.data, label: action.label }].slice(-HISTORY_LIMIT),
      };
    case 'undo': {
      const previous = state.past[state.past.length - 1];
      return previous ? { data: previous.data, past: state.past.slice(0, -1) } : state;
    }
  }
};

const SAVE_DELAY_MS = 400;

export interface CvStore {
  data: CVData;
  update: (recipe: Recipe) => void;
  commit: (label: string, recipe: Recipe) => boolean;
  /** Returns the label of the change that was undone, if any. */
  undo: () => string | null;
  canUndo: boolean;
  /** False if the last attempt to save to the browser failed. */
  saveOk: boolean;
}

const same = (a: CVData, b: CVData) => a === b || JSON.stringify(a) === JSON.stringify(b);

export const useCvStore = (load: () => CVData = loadCv, save: (data: CVData) => boolean = saveCv): CvStore => {
  const [state, dispatch] = useReducer(cvReducer, undefined, (): CvState => ({ data: load(), past: [] }));
  const [saveOk, setSaveOk] = useState(true);
  const stateRef = useRef(state);
  const dirty = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounced save: typing doesn't serialise the whole CV on every keystroke.
  useEffect(() => {
    dirty.current = true;
    const timer = window.setTimeout(() => {
      dirty.current = false;
      setSaveOk(save(state.data));
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state.data, save]);

  // Flush pending changes if the tab is hidden or closed before the timer fires.
  useEffect(() => {
    const flush = () => {
      if (!dirty.current) return;
      dirty.current = false;
      save(stateRef.current.data);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [save]);

  const update = useCallback((recipe: Recipe) => dispatch({ type: 'update', recipe }), []);

  const commit = useCallback((label: string, recipe: Recipe) => {
    const current = stateRef.current.data;
    const next = recipe(current);
    if (same(current, next)) return false;
    stateRef.current = { data: next, past: [...stateRef.current.past, { data: current, label }] };
    dispatch({ type: 'commit', next, label });
    return true;
  }, []);

  const undo = useCallback(() => {
    const { past } = stateRef.current;
    const previous = past[past.length - 1];
    if (!previous) return null;
    stateRef.current = { data: previous.data, past: past.slice(0, -1) };
    dispatch({ type: 'undo' });
    return previous.label;
  }, []);

  return { data: state.data, update, commit, undo, canUndo: state.past.length > 0, saveOk };
};
