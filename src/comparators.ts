export type ComparableDate =
    | Temporal.PlainDate
    | Temporal.PlainTime
    | Temporal.PlainDateTime
    | Temporal.ZonedDateTime;

/**
 * Returns true if the Temporal is equal to the reference.
 *
 * This comparator is different from the Temporal's `equals` method, as it only
 * compares the point in time, ignoring the calendar system.
 */
export const isEqual = <T extends ComparableDate>(temporal: T, reference: NoInfer<T>): boolean => {
    return compare(temporal, reference) === 0;
};

/**
 * Returns true if the Temporal is before the reference.
 */
export const isBefore = <T extends ComparableDate>(temporal: T, reference: NoInfer<T>): boolean => {
    return compare(temporal, reference) < 0;
};

/**
 * Returns true if the Temporal is before or equal to the reference.
 */
export const isBeforeOrEqual = <T extends ComparableDate>(
    temporal: T,
    reference: NoInfer<T>,
): boolean => {
    return compare(temporal, reference) <= 0;
};

/**
 * Returns true if the Temporal is after the reference.
 */
export const isAfter = <T extends ComparableDate>(temporal: T, reference: NoInfer<T>): boolean => {
    return compare(temporal, reference) > 0;
};

/**
 * Returns true if the Temporal is after or equal to the reference.
 */
export const isAfterOrEqual = <T extends ComparableDate>(
    temporal: T,
    reference: NoInfer<T>,
): boolean => {
    return compare(temporal, reference) >= 0;
};

const compare = <T extends ComparableDate>(temporal: T, reference: NoInfer<T>): number => {
    if (temporal.constructor !== reference.constructor) {
        throw new TypeError("Both values must be of the same Temporal type");
    }

    const ctor = temporal.constructor as unknown as { compare(a: T, b: T): number };
    return ctor.compare(temporal, reference);
};
