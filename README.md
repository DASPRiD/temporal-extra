# temporal-extra

[![Release](https://github.com/dasprid/temporal-extra/actions/workflows/release.yml/badge.svg)](https://github.com/dasprid/temporal-extra/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/DASPRiD/temporal-extra/graph/badge.svg?token=CVKPbXSUdn)](https://codecov.io/gh/DASPRiD/temporal-extra)

Locale-aware Temporal utilities for ISO week numbers, business day navigation, and calendar inspections.
Built on top of the Temporal API, with optional polyfill support.

# Features

- Adjusters: Jump to previous/next business day, week day, or boundary of a month/year.
- Inspectors: Get accurate week numbers using locale-specific rules (like ISO-8601, US, or Middle Eastern systems).
- Polyfill support: Includes a tiny TypeScript-compatible Intl.Locale.getWeekInfo() polyfill.

# Installation

Install via your favorite package manager:

```bash
npm install temporal-extra
# or
pnpm add temporal-extra
# or
yarn add temporal-extra
```

# Using the Temporal Polyfill

If you want to use the [Temporal API](https://tc39.es/proposal-temporal/) in environments where it is not yet natively
supported, you can include the [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill).

Once you have it installed, you can enable it:

```ts
if (typeof Temporal === "undefined") {
    await import("temporal-polyfill/global");
}
```

This will globally patch the environment, adding the Temporal API on `globalThis.Temporal`.

## TypeScript support for Temporal

To get proper TypeScript typings for the polyfill (and the Temporal API in general), you need to install the
[temporal-spec](https://www.npmjs.com/package/temporal-spec) types package.

Then create a `temporal.d.ts` file in your project (e.g., in your `src` folder or your `types` folder) with the
following content:

```ts
import "temporal-spec/global";
```

This will augment the TypeScript global scope with Temporal API types, so your editor and compiler understand `Temporal`
properly.

# Usage

## Adjusters

Adjust or navigate `PlainDate`, `PlainDateTime`, or `ZonedDateTime` instances:

```ts
import {
  previousBusinessDay,
  nextDayOfWeek,
  firstDayOfMonth,
  lastDayOfYear,
} from "temporal-extra";

const date = Temporal.PlainDate.from("2024-06-18");

previousBusinessDay(date, [6, 7]); // skips Sat/Sun
nextDayOfWeek(date, 5);            // jump to next Friday
firstDayOfMonth(date);             // 2024-06-01
lastDayOfYear(date);               // 2024-12-31
```

All functions are type-safe and maintain the input type (`PlainDate`, `PlainDateTime`, or `ZonedDateTime`).

## Polyfill support

The module automatically loads the `Intl.Locale.getWeekInfo()` polyfill only when needed (e.g. in Node or older
environments). But you can import it explicitly too:

```ts
import "temporal-extra/week-info/polyfill";
```

> **NOTE**: This also automatically augments the global TypeScript types for `Intl.Locale.prototype.getWeekInfo`.

Now you can use the API even when your environment does not support it:

```ts
new Intl.Locale("de-DE").getWeekInfo();
// { firstDay: 1, weekend: [6, 7] }
```

The polyfill is tiny, brotli-compressed clocking in at just a little over 400 bytes! 
