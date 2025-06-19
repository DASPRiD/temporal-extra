import "./global.js";
import type { PartialWeekInfo } from "./week-data.js";

/* node:coverage disable */
if (!("getWeekInfo" in Intl.Locale.prototype)) {
    const { worldDefaults, regionData } = await import("./week-data.js");

    type WeekInfo = {
        firstDay: number;
        minimalDays: number;
        weekend: number[];
    };

    const expandWeekInfo = (weekInfo: PartialWeekInfo): WeekInfo => ({
        firstDay: weekInfo[0],
        minimalDays: weekInfo[1] ?? worldDefaults[1],
        weekend: weekInfo[2] ?? worldDefaults[2],
    });

    Object.defineProperty(Intl.Locale.prototype, "getWeekInfo", {
        value: function (this: Intl.Locale) {
            const region = this.maximize().region;

            if (!(region && region in regionData)) {
                return expandWeekInfo(worldDefaults);
            }

            return expandWeekInfo(regionData[region]);
        },
        writable: true,
        configurable: true,
    });
}
