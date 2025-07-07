import "./week-info/polyfill.js";

export type InspectableDate = Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime;

const getFirstWeekStart = (year: number, weekInfo: Intl.WeekInfo): Temporal.PlainDate => {
    const yearDate = Temporal.PlainDate.from({ year: year, month: 1, day: 1 });
    const dayOfYearStart = yearDate.dayOfWeek;
    const offset = (7 + dayOfYearStart - weekInfo.firstDay) % 7;

    if (7 - offset >= weekInfo.minimalDays) {
        return yearDate.subtract({ days: offset });
    }

    return yearDate.add({ days: 7 - offset });
};

/**
 * Calculates locale-aware week number.
 */
export const localeAwareWeekNumber = (
    date: InspectableDate,
    locale: Intl.Locale | string,
): number => {
    const weekInfo = (typeof locale === "string" ? new Intl.Locale(locale) : locale).getWeekInfo();
    const thisYearFirstWeekStart = getFirstWeekStart(date.year, weekInfo);

    if (Temporal.PlainDate.compare(date, thisYearFirstWeekStart) < 0) {
        const prevYearFirstWeekStart = getFirstWeekStart(date.year - 1, weekInfo);
        return prevYearFirstWeekStart.until(thisYearFirstWeekStart, { largestUnit: "weeks" }).weeks;
    }

    const nextYearFirstWeekStart = getFirstWeekStart(date.year + 1, weekInfo);

    if (Temporal.PlainDate.compare(date, nextYearFirstWeekStart) >= 0) {
        return 1;
    }

    const diff = thisYearFirstWeekStart.until(date, { largestUnit: "weeks" }).weeks;
    return Math.floor(diff) + 1;
};
