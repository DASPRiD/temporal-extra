declare global {
    namespace Intl {
        type WeekInfo = {
            firstDay: number;
            weekend: number[];
        };

        interface Locale {
            getWeekInfo(): WeekInfo;
        }
    }
}
