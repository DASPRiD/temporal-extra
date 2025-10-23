import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import rawTerritoryInfo from "cldr-core/supplemental/territoryInfo.json" with { type: "json" };
import rawWeekData from "cldr-core/supplemental/weekData.json" with { type: "json" };

const resolveWeekDayNumber = (key: string): number => {
    switch (key) {
        case "mon":
            return 1;
        case "tue":
            return 2;
        case "wed":
            return 3;
        case "thu":
            return 4;
        case "fri":
            return 5;
        case "sat":
            return 6;
        case "sun":
            return 7;
    }

    throw new Error(`Unexpected week day key: ${key}`);
};

const { weekData } = rawWeekData.supplemental;

const getFirstDay = (region: string): [string, boolean] => {
    const rawFirstDay =
        weekData.firstDay[region as keyof typeof weekData.firstDay] ?? weekData.firstDay["001"];

    if (!rawFirstDay) {
        throw new Error(`Failed to find first day for ${region}`);
    }

    return [
        resolveWeekDayNumber(rawFirstDay).toString(),
        region !== "001" && rawFirstDay === weekData.firstDay["001"],
    ];
};

const getWeekend = (region: string): [string, boolean] => {
    const rawWeekendStart =
        weekData.weekendStart[region as keyof typeof weekData.weekendStart] ??
        weekData.weekendStart["001"];
    const rawWeekendEnd =
        weekData.weekendEnd[region as keyof typeof weekData.weekendEnd] ??
        weekData.weekendEnd["001"];

    if (!(rawWeekendStart && rawWeekendEnd)) {
        throw new Error(`Failed to find weekend for ${region}`);
    }

    const weekendStart = resolveWeekDayNumber(rawWeekendStart);
    const weekendEnd = resolveWeekDayNumber(rawWeekendEnd);

    if (weekendStart > weekendEnd) {
        throw new Error(`[${region}] Weekend start can't be after end`);
    }

    const weekend = [];

    for (let i = weekendStart; i <= weekendEnd; ++i) {
        weekend.push(i);
    }

    return [
        `[${weekend.join(", ")}]`,
        region !== "001" &&
            rawWeekendStart === weekData.weekendStart["001"] &&
            rawWeekendEnd === weekData.weekendEnd["001"],
    ];
};

const packRegionData = (region: string): string | null => {
    const elements = [getFirstDay(region), getWeekend(region)];

    while (elements.length > 0 && elements[elements.length - 1][1]) {
        elements.pop();
    }

    if (elements.length === 0) {
        return null;
    }

    return `[${elements.map(([value]) => value).join(", ")}]`;
};

const worldDefaults = packRegionData("001");

if (!worldDefaults) {
    throw new Error("World defaults (001) not found");
}

type RegionData = Record<string, string>;
const regionData: RegionData = {};

for (const region of Object.keys(rawTerritoryInfo.supplemental.territoryInfo)) {
    const data = packRegionData(region);

    if (!data) {
        continue;
    }

    regionData[region] = data;
}

const formatRegionData = (data: RegionData): string => {
    const result = ["{\n"];

    for (const [region, info] of Object.entries(data)) {
        result.push(`    ${region}: ${info},\n`);
    }

    result.push("}");

    return result.join("");
};

const typescript = [
    "// Auto generated, do not modify manually\n",
    "export type CompleteWeekInfo = [number, number[]];\n",
    "export type PartialWeekInfo = [number, number[]?];\n",
    "export type RegionData = Record<string, PartialWeekInfo>;\n\n",
    `export const worldDefaults: CompleteWeekInfo = ${worldDefaults};\n`,
    `export const regionData: RegionData = ${formatRegionData(regionData)};\n`,
].join("");

const path = fileURLToPath(new URL("../week-info/week-data.ts", import.meta.url));
writeFileSync(path, typescript);
