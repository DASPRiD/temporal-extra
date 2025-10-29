import "./week-info/polyfill.js";

export type AdjustableDate = Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime;

/**
 * Returns the previous business day dependent on locale.
 */
export const previousBusinessDay = <T extends AdjustableDate>(
    date: T,
    locale: Intl.Locale | string,
): T => {
    const { weekend } = (
        typeof locale === "string" ? new Intl.Locale(locale) : locale
    ).getWeekInfo();
    let diff = 1;

    while (weekend.includes(((date.dayOfWeek - diff - 1 + 7) % 7) + 1)) {
        diff++;
    }

    return date.subtract({ days: diff }) as T;
};

/**
 * Returns the next business day dependent on locale.
 */
export const nextBusinessDay = <T extends AdjustableDate>(
    date: T,
    locale: Intl.Locale | string,
): T => {
    const { weekend } = (
        typeof locale === "string" ? new Intl.Locale(locale) : locale
    ).getWeekInfo();
    let diff = 1;

    while (weekend.includes(((date.dayOfWeek + diff - 1 + 7) % 7) + 1)) {
        diff++;
    }

    return date.add({ days: diff }) as T;
};

/**
 * Returns the most recent day matching a given day of week.
 */
export const previousDayOfWeek = <T extends AdjustableDate>(date: T, dayOfWeek: number): T => {
    const diff = dayOfWeek - date.dayOfWeek;
    return date.subtract({ days: diff >= 0 ? 7 - diff : -diff }) as T;
};

/**
 * Returns the most recent or same day matching a given day of week.
 */
export const previousOrSameDayOfWeek = <T extends AdjustableDate>(
    date: T,
    dayOfWeek: number,
): T => {
    if (date.dayOfWeek === dayOfWeek) {
        return date;
    }

    const diff = dayOfWeek - date.dayOfWeek;
    return date.subtract({ days: diff >= 0 ? 7 - diff : -diff }) as T;
};

/**
 * Returns the closest next day matching a given day of week.
 */
export const nextDayOfWeek = <T extends AdjustableDate>(date: T, dayOfWeek: number): T => {
    const diff = date.dayOfWeek - dayOfWeek;
    return date.add({ days: diff >= 0 ? 7 - diff : -diff }) as T;
};

/**
 * Returns the closest next or same day matching a given day of week.
 */
export const nextOrSameDayOfWeek = <T extends AdjustableDate>(date: T, dayOfWeek: number): T => {
    if (date.dayOfWeek === dayOfWeek) {
        return date;
    }

    const diff = date.dayOfWeek - dayOfWeek;
    return date.add({ days: diff >= 0 ? 7 - diff : -diff }) as T;
};

/**
 * Returns the first day of the week dependent on locale.
 */
export const firstDayOfWeek = <T extends AdjustableDate>(
    date: T,
    locale: Intl.Locale | string,
): T => {
    const { firstDay } = (
        typeof locale === "string" ? new Intl.Locale(locale) : locale
    ).getWeekInfo();

    const diff = date.dayOfWeek - firstDay;
    return date.subtract({ days: diff >= 0 ? diff : 7 + diff }) as T;
};

/**
 * Returns the last day of the week dependent on locale.
 */
export const lastDayOfWeek = <T extends AdjustableDate>(
    date: T,
    locale: Intl.Locale | string,
): T => {
    const { firstDay } = (
        typeof locale === "string" ? new Intl.Locale(locale) : locale
    ).getWeekInfo();

    const lastDay = ((firstDay + 5) % 7) + 1;
    const diff = lastDay - date.dayOfWeek;
    return date.add({ days: diff >= 0 ? diff : 7 + diff }) as T;
};

/**
 * Returns the first day of the month.
 */
export const firstDayOfMonth = <T extends AdjustableDate>(date: T): T => {
    return date.with({ day: 1 }) as T;
};

/**
 * Returns the last day of the month.
 */
export const lastDayOfMonth = <T extends AdjustableDate>(date: T): T => {
    return date.with({ day: date.daysInMonth }) as T;
};

/**
 * Returns the first day of the year.
 */
export const firstDayOfYear = <T extends AdjustableDate>(date: T): T => {
    return date.with({ month: 1, day: 1 }) as T;
};

/**
 * Returns the last day of the year.
 */
export const lastDayOfYear = <T extends AdjustableDate>(date: T): T => {
    const lastMonth = date.with({ month: date.monthsInYear });
    return lastMonth.with({ day: lastMonth.daysInMonth }) as T;
};

/**
 * Returns the first day of the next month.
 */
export const firstDayOfNextMonth = <T extends AdjustableDate>(date: T): T => {
    return date.month === date.monthsInYear
        ? (date.with({ year: date.year + 1, month: 1, day: 1 }) as T)
        : (date.with({ month: date.month + 1, day: 1 }) as T);
};

/**
 * Returns the first day of the next year.
 */
export const firstDayOfNextYear = <T extends AdjustableDate>(date: T): T => {
    return date.with({ year: date.year + 1, month: 1, day: 1 }) as T;
};

/**
 * Returns the start of the day.
 */
export const startOfDay = <
    T extends Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime,
>(
    dateTime: T,
): T => {
    return dateTime.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
    }) as T;
};

/**
 * Returns the end of the day.
 */
export const endOfDay = <
    T extends Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime,
>(
    dateTime: T,
): T => {
    return dateTime.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
    }) as T;
};
