/**
 * Date helpers for CV dates.
 *
 * CV dates are stored as the strings produced by `<input type="month">`
 * ("2024-03") or as a bare year ("2024"). They are calendar values, not
 * moments in time, so they must never go through `new Date(string)`: that
 * parses as UTC midnight and shows the previous month in timezones west of
 * UTC (e.g. "2024-03" became "Feb 2024" in New York).
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface YearMonth {
  year: number;
  /** 1-12, or undefined for a bare year. */
  month?: number;
}

export const parseYearMonth = (value: string): YearMonth | null => {
  const match = /^\s*(\d{4})(?:-(\d{1,2}))?\s*$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  if (match[2] === undefined) return { year };
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
};

/** "2024-03" → "Mar 2024", "2024" → "2024". Anything else is returned as typed. */
export const formatYearMonth = (value: string): string => {
  if (!value) return '';
  const parsed = parseYearMonth(value);
  if (!parsed) return value.trim();
  return parsed.month ? `${MONTHS[parsed.month - 1]} ${parsed.year}` : String(parsed.year);
};

export const formatDateRange = (start: string, end: string, current = false): string => {
  const from = formatYearMonth(start);
  const to = current ? 'Present' : formatYearMonth(end);
  if (from && to) return from === to ? from : `${from} – ${to}`;
  return from || to;
};

/** Comparable number for ordering dates; bare years sort as January. */
const toOrdinal = ({ year, month }: YearMonth) => year * 12 + (month ?? 1) - 1;

/** True when both dates parse and `end` is before `start`. */
export const isEndBeforeStart = (start: string, end: string): boolean => {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  if (!a || !b) return false;
  // Compare at year precision if either side is a bare year.
  if (a.month === undefined || b.month === undefined) return b.year < a.year;
  return toOrdinal(b) < toOrdinal(a);
};
