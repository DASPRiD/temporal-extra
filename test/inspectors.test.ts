import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localeAwareWeekNumber } from "../src/index.js";

if (typeof Temporal === "undefined") {
    await import("temporal-polyfill/global");
}

describe("inspectors", () => {
    describe("localeAwareWeekNumber", () => {
        const locales = [
            {
                tag: "en-US",
                edgeCases: [
                    { date: "2023-12-31", expected: 1 },
                    { date: "2024-01-01", expected: 1 },
                    { date: "2024-01-07", expected: 2 },
                    { date: "2024-12-29", expected: 1 },
                    { date: "2024-12-31", expected: 1 },
                ],
            },
            {
                tag: "de-DE",
                edgeCases: [
                    { date: "2023-01-01", expected: 52 },
                    { date: "2023-12-25", expected: 52 },
                    { date: "2023-12-31", expected: 52 },
                    { date: "2024-01-01", expected: 1 },
                    { date: "2024-01-07", expected: 1 },
                    { date: "2024-01-08", expected: 2 },
                ],
            },
        ];

        it("accepts string object", () => {
            const date = Temporal.PlainDate.from("2025-01-01");
            const week = localeAwareWeekNumber(date, "en-US");
            assert.equal(week, 1);
        });

        for (const { tag, edgeCases } of locales) {
            describe(`Locale: ${tag}`, () => {
                const locale = new Intl.Locale(tag);

                it("handles different Temporal types", () => {
                    const date = Temporal.PlainDateTime.from("2025-01-15T13:45:00");
                    const zdt = Temporal.ZonedDateTime.from("2025-01-15T13:45[Europe/Berlin]");

                    assert.equal(
                        localeAwareWeekNumber(date, locale),
                        localeAwareWeekNumber(Temporal.PlainDate.from(date), locale),
                        `${tag}: PlainDateTime matches PlainDate`,
                    );

                    assert.equal(
                        localeAwareWeekNumber(zdt, locale),
                        localeAwareWeekNumber(zdt.toPlainDate(), locale),
                        `${tag}: ZonedDateTime matches PlainDate`,
                    );
                });

                it("handles end/start year weeks", () => {
                    for (const { date, expected } of edgeCases) {
                        const week = localeAwareWeekNumber(Temporal.PlainDate.from(date), locale);
                        assert.equal(week, expected, `${tag}: ${date} week should be ${expected}`);
                    }
                });
            });
        }
    });
});
