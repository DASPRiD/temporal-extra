import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    MONDAY,
    SATURDAY,
    SUNDAY,
    TUESDAY,
    WEDNESDAY,
    endOfDay,
    firstDayOfMonth,
    firstDayOfNextMonth,
    firstDayOfNextYear,
    firstDayOfWeek,
    firstDayOfYear,
    lastDayOfMonth,
    lastDayOfWeek,
    lastDayOfYear,
    nextBusinessDay,
    nextDayOfWeek,
    nextOrSameDayOfWeek,
    previousBusinessDay,
    previousDayOfWeek,
    previousOrSameDayOfWeek,
    startOfDay,
} from "../src/index.js";

if (typeof Temporal === "undefined") {
    await import("temporal-polyfill/global");
}

const makeDate = (iso: string) => Temporal.PlainDate.from(iso);

describe("adjusters", () => {
    describe("previousBusinessDay", () => {
        it("skips weekend backwards", () => {
            const friday = makeDate("2024-06-14");
            const monday = makeDate("2024-06-17");

            assert.equal(
                previousBusinessDay(monday, new Intl.Locale("de-DE")).toString(),
                "2024-06-14",
            );
            assert.equal(previousBusinessDay(friday, "de-DE").toString(), "2024-06-13");
        });
    });

    describe("nextBusinessDay", () => {
        it("skips weekend forward", () => {
            const friday = makeDate("2024-06-14");
            const sunday = makeDate("2024-06-16");

            assert.equal(
                nextBusinessDay(friday, new Intl.Locale("de-DE")).toString(),
                "2024-06-17",
            );
            assert.equal(nextBusinessDay(sunday, "de-DE").toString(), "2024-06-17");
        });
    });

    describe("previousDayOfWeek", () => {
        it("returns previous weekday", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(previousDayOfWeek(tuesday, MONDAY).toString(), "2024-06-17");
            assert.equal(previousDayOfWeek(tuesday, TUESDAY).toString(), "2024-06-11");
        });
    });

    describe("previousOrSameDayOfWeek", () => {
        it("returns same day if matches", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(previousOrSameDayOfWeek(tuesday, TUESDAY).toString(), "2024-06-18");
        });

        it("returns previous when not matching (diff >= 0)", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(previousOrSameDayOfWeek(tuesday, MONDAY).toString(), "2024-06-17");
        });

        it("returns previous when not matching (diff < 0)", () => {
            const monday = makeDate("2024-06-17");
            assert.equal(previousOrSameDayOfWeek(monday, SUNDAY).toString(), "2024-06-16");
        });
    });

    describe("nextDayOfWeek", () => {
        it("returns next weekday", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(nextDayOfWeek(tuesday, WEDNESDAY).toString(), "2024-06-19");
            assert.equal(nextDayOfWeek(tuesday, TUESDAY).toString(), "2024-06-25");
        });
    });

    describe("nextOrSameDayOfWeek", () => {
        it("returns same day if matches", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(nextOrSameDayOfWeek(tuesday, TUESDAY).toString(), "2024-06-18");
        });

        it("returns next when not matching (diff >= 0)", () => {
            const tuesday = makeDate("2024-06-18");
            assert.equal(nextOrSameDayOfWeek(tuesday, WEDNESDAY).toString(), "2024-06-19");
        });

        it("returns next when not matching (diff < 0)", () => {
            const saturday = makeDate("2024-06-15");
            assert.equal(nextOrSameDayOfWeek(saturday, TUESDAY).toString(), "2024-06-18");
        });
    });

    describe("firstDayOfWeek", () => {
        const wednesday = Temporal.PlainDate.from("2024-06-19");

        it("returns Sunday for en-US", () => {
            const result = firstDayOfWeek(wednesday, "en-US");
            assert.equal(result.dayOfWeek, SUNDAY);
            assert.equal(result.toString(), "2024-06-16");
        });

        it("returns Monday for de-DE", () => {
            const result = firstDayOfWeek(wednesday, "de-DE");
            assert.equal(result.dayOfWeek, MONDAY);
            assert.equal(result.toString(), "2024-06-17");
        });

        it("supports Intl.Locale instances", () => {
            const result = firstDayOfWeek(wednesday, new Intl.Locale("fr-FR"));
            assert.equal(result.dayOfWeek, MONDAY);
            assert.equal(result.toString(), "2024-06-17");
        });
    });

    describe("lastDayOfWeek", () => {
        const wednesday = Temporal.PlainDate.from("2024-06-19");

        it("returns Saturday for en-US", () => {
            const result = lastDayOfWeek(wednesday, "en-US");
            assert.equal(result.dayOfWeek, SATURDAY);
            assert.equal(result.toString(), "2024-06-22");
        });

        it("returns Sunday for de-DE", () => {
            const result = lastDayOfWeek(wednesday, "de-DE");
            assert.equal(result.dayOfWeek, SUNDAY);
            assert.equal(result.toString(), "2024-06-23");
        });

        it("correctly wraps around when input day is after lastDay (diff < 0 case)", () => {
            const sunday = Temporal.PlainDate.from("2024-06-23");
            const result = lastDayOfWeek(sunday, "en-US");
            assert.equal(result.dayOfWeek, SATURDAY);
            assert.equal(result.toString(), "2024-06-29");
        });

        it("supports Intl.Locale instances", () => {
            const result = lastDayOfWeek(wednesday, new Intl.Locale("fr-FR"));
            assert.equal(result.dayOfWeek, SUNDAY);
            assert.equal(result.toString(), "2024-06-23");
        });
    });

    describe("firstDayOfMonth", () => {
        it("returns 1st of same month", () => {
            const date = makeDate("2024-06-18");
            assert.equal(firstDayOfMonth(date).toString(), "2024-06-01");
        });
    });

    describe("lastDayOfMonth", () => {
        it("returns last day of month", () => {
            const date = makeDate("2024-06-18");
            assert.equal(lastDayOfMonth(date).toString(), "2024-06-30");
        });
    });

    describe("firstDayOfYear", () => {
        it("returns 1st Jan of year", () => {
            const date = makeDate("2024-06-18");
            assert.equal(firstDayOfYear(date).toString(), "2024-01-01");
        });
    });

    describe("lastDayOfYear", () => {
        it("returns last day in ISO calendar", () => {
            const date = makeDate("2024-06-18");
            assert.equal(lastDayOfYear(date).toString(), "2024-12-31");
        });

        it("returns last day in hebrew calendar", () => {
            const date = makeDate("2024-06-18").withCalendar("hebrew");
            assert.equal(lastDayOfYear(date).toString(), "2024-10-02[u-ca=hebrew]");
        });
    });

    describe("firstDayOfNextMonth", () => {
        it("returns next month's 1st in ISO calendar", () => {
            const june = makeDate("2024-06-18");
            assert.equal(firstDayOfNextMonth(june).toString(), "2024-07-01");

            const dec = makeDate("2024-12-15");
            assert.equal(firstDayOfNextMonth(dec).toString(), "2025-01-01");
        });

        it("returns next month's 1st in hebrew calendar", () => {
            const june = makeDate("2024-06-18").withCalendar("hebrew");
            assert.equal(firstDayOfNextMonth(june).toString(), "2024-07-07[u-ca=hebrew]");

            const dec = makeDate("2024-12-15").withCalendar("hebrew");
            assert.equal(firstDayOfNextMonth(dec).toString(), "2025-01-01[u-ca=hebrew]");
        });
    });

    describe("firstDayOfNextYear", () => {
        it("returns Jan 1 of next year", () => {
            const date = makeDate("2024-06-18");
            assert.equal(firstDayOfNextYear(date).toString(), "2025-01-01");
        });
    });

    describe("startOfDay", () => {
        it("returns start of a given day", () => {
            const date = Temporal.PlainDateTime.from("2025-01-01T15:12:44");
            assert.equal(startOfDay(date).toString(), "2025-01-01T00:00:00");
        });
    });

    describe("endOfDay", () => {
        it("returns end of a given day", () => {
            const date = Temporal.PlainDateTime.from("2025-01-01T15:12:44");
            assert.equal(endOfDay(date).toString(), "2025-01-01T23:59:59.999999999");
        });
    });
});
