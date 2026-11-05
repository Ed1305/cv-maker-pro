import { formatDateRange, formatYearMonth, isEndBeforeStart, parseYearMonth } from './dates';

describe('dates', () => {
  it('runs these tests west of UTC, where the old bug showed up', () => {
    expect(new Date('2024-03').getMonth()).toBe(1); // what `new Date` does: Feb in New York
  });

  it('formats month values without shifting them by timezone', () => {
    expect(formatYearMonth('2024-03')).toBe('Mar 2024');
    expect(formatYearMonth('2024-01')).toBe('Jan 2024');
    expect(formatYearMonth('2024-12')).toBe('Dec 2024');
  });

  it('keeps bare years and free text as typed', () => {
    expect(formatYearMonth('2019')).toBe('2019');
    expect(formatYearMonth('Summer 2019 ')).toBe('Summer 2019');
    expect(formatYearMonth('')).toBe('');
  });

  it('rejects impossible months', () => {
    expect(parseYearMonth('2024-13')).toBeNull();
  });

  it('formats ranges', () => {
    expect(formatDateRange('2021-03', '', true)).toBe('Mar 2021 – Present');
    expect(formatDateRange('2015', '2018')).toBe('2015 – 2018');
    expect(formatDateRange('2015', '')).toBe('2015');
    expect(formatDateRange('', '2018')).toBe('2018');
    expect(formatDateRange('2020-05', '2020-05')).toBe('May 2020');
  });

  it('detects end dates before start dates', () => {
    expect(isEndBeforeStart('2021-03', '2020-12')).toBe(true);
    expect(isEndBeforeStart('2021-03', '2021-03')).toBe(false);
    expect(isEndBeforeStart('2021', '2021-01')).toBe(false);
    expect(isEndBeforeStart('2021', '2020')).toBe(true);
    expect(isEndBeforeStart('', '2020')).toBe(false);
  });
});
