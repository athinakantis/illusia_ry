import { CalendarDate } from "@internationalized/date";
import type { RangeValue } from '@react-types/shared';


function compareDatesManually(a: CalendarDate, b: CalendarDate): number {
    if (a.year !== b.year) return a.year < b.year ? -1 : 1;
    if (a.month !== b.month) return a.month < b.month ? -1 : 1;
    if (a.day !== b.day) return a.day < b.day ? -1 : 1;
    return 0;
}

export function getOverlappingRange(
    startA: CalendarDate,
    endA: CalendarDate,
    startB: CalendarDate,
    endB: CalendarDate
): RangeValue<CalendarDate> | null {
    if (
        compareDatesManually(startA, endB) <= 0 &&
        compareDatesManually(startB, endA) <= 0
    ) {
        const overlapStart = compareDatesManually(startA, startB) > 0 ? startA : startB;
        const overlapEnd = compareDatesManually(endA, endB) < 0 ? endA : endB;

        return { start: overlapStart, end: overlapEnd };
    }

    return null;
}