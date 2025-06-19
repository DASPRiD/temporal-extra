declare global {
    namespace Intl {
        type WeekInfo = {
            firstDay: number;
            minimalDays: number;
            weekend: number[];
        };

        interface Locale {
            getWeekInfo(): WeekInfo;
        }
    }
}
