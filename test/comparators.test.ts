import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAfter, isAfterOrEqual, isBefore, isBeforeOrEqual, isEqual } from "../src/index.js";

if (typeof Temporal === "undefined") {
    await import("temporal-polyfill/global");
}

describe("comparators", () => {
    const plainDate1 = Temporal.PlainDate.from("2024-06-18");
    const plainDate2 = Temporal.PlainDate.from("2024-06-19");

    const plainTime1 = Temporal.PlainTime.from("10:00");
    const plainTime2 = Temporal.PlainTime.from("11:00");

    const plainDateTime1 = Temporal.PlainDateTime.from("2024-06-18T10:00");
    const plainDateTime2 = Temporal.PlainDateTime.from("2024-06-18T11:00");

    const zonedDateTime1 = Temporal.ZonedDateTime.from("2024-06-18T10:00:00Z[UTC]");
    const zonedDateTime2 = Temporal.ZonedDateTime.from("2024-06-18T11:00:00Z[UTC]");

    describe("isEqual", () => {
        it("returns true for different calendar systems", () => {
            assert.equal(isEqual(plainDate1, plainDate1.withCalendar("hebrew")), true);
        });
    });

    describe("isBefore", () => {
        it("works for PlainDate", () => {
            assert.equal(isBefore(plainDate1, plainDate2), true);
            assert.equal(isBefore(plainDate2, plainDate1), false);
        });

        it("works for PlainTime", () => {
            assert.equal(isBefore(plainTime1, plainTime2), true);
            assert.equal(isBefore(plainTime2, plainTime1), false);
        });

        it("works for PlainDateTime", () => {
            assert.equal(isBefore(plainDateTime1, plainDateTime2), true);
            assert.equal(isBefore(plainDateTime2, plainDateTime1), false);
        });

        it("works for ZonedDateTime", () => {
            assert.equal(isBefore(zonedDateTime1, zonedDateTime2), true);
            assert.equal(isBefore(zonedDateTime2, zonedDateTime1), false);
        });

        it("throws when types mismatch", () => {
            assert.throws(
                () => isBefore<Temporal.PlainDate | Temporal.PlainTime>(plainDate1, plainTime1),
                /Both values must be of the same Temporal type/,
            );
        });

        it("returns false for equal values", () => {
            assert.equal(isBefore(plainDate1, plainDate1), false);
        });
    });

    describe("isBeforeOrEqual", () => {
        it("returns true for equal values", () => {
            assert.equal(isBeforeOrEqual(plainDate1, plainDate1), true);
        });

        it("returns correct results for other cases", () => {
            assert.equal(isBeforeOrEqual(plainDate1, plainDate2), true);
            assert.equal(isBeforeOrEqual(plainDate2, plainDate1), false);
        });
    });

    describe("isAfter", () => {
        it("returns false for equal values", () => {
            assert.equal(isAfter(plainDate1, plainDate1), false);
        });

        it("returns true when first is after second", () => {
            assert.equal(isAfter(plainDate2, plainDate1), true);
            assert.equal(isAfter(plainDate1, plainDate2), false);
        });
    });

    describe("isAfterOrEqual", () => {
        it("returns true for equal values", () => {
            assert.equal(isAfterOrEqual(plainDate1, plainDate1), true);
        });

        it("returns correct results for other cases", () => {
            assert.equal(isAfterOrEqual(plainDate2, plainDate1), true);
            assert.equal(isAfterOrEqual(plainDate1, plainDate2), false);
        });
    });
});
