import { add, addMilliseconds, sub, subMilliseconds } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import debug from "debug";
const DURATION_KEYS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
const logCronyx = debug("cronyx");
/**
 * @internal
 */
export function isDuration(obj) {
    if (typeof obj !== "object" || obj === null)
        return false;
    for (const key in obj) {
        if (!DURATION_KEYS.includes(key))
            return false;
        const value = obj[key];
        if (value !== undefined && typeof value !== "number")
            return false;
    }
    return true;
}
/**
 * @internal
 */
export function addInterval(date, interval, timezone) {
    if (isDuration(interval)) {
        const zonedJobIntervalStartedAt = utcToZonedTime(date, timezone);
        const zonedJobIntervalEndedAt = add(zonedJobIntervalStartedAt, interval);
        return zonedTimeToUtc(zonedJobIntervalEndedAt, timezone);
    }
    return addMilliseconds(date, interval);
}
/**
 * @internal
 */
export function subInterval(date, interval, timezone) {
    if (isDuration(interval)) {
        const zonedJobIntervalEndedAt = utcToZonedTime(date, timezone);
        const zonedJobIntervalStartedAt = sub(zonedJobIntervalEndedAt, interval);
        return zonedTimeToUtc(zonedJobIntervalStartedAt, timezone);
    }
    return subMilliseconds(date, interval);
}
/**
 * @internal
 */
export function getLastDeactivatedJobIntervalEndedAt(lastJobLock) {
    return lastJobLock.isActive
        ? subMilliseconds(lastJobLock.jobIntervalEndedAt, lastJobLock.jobInterval)
        : lastJobLock.jobIntervalEndedAt;
}
/**
 * @internal
 */
export function hasErrorCode(error) {
    return error instanceof Error && typeof error.code === "string";
}
/**
 * @internal
 */
export function log(formatter, ...args) {
    logCronyx(formatter, ...args);
}
//# sourceMappingURL=util.js.map