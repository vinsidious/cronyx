"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.hasErrorCode = exports.getLastDeactivatedJobIntervalEndedAt = exports.subInterval = exports.addInterval = exports.isDuration = void 0;
const cron_parser_1 = require("cron-parser");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const debug_1 = require("debug");
const DURATION_KEYS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
const logCronyx = (0, debug_1.default)("cronyx");
/**
 * @internal
 */
function isDuration(obj) {
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
exports.isDuration = isDuration;
/**
 * @internal
 */
function addInterval(date, interval, timezone) {
    if (isDuration(interval)) {
        const zonedJobIntervalStartedAt = (0, date_fns_tz_1.utcToZonedTime)(date, timezone);
        const zonedJobIntervalEndedAt = (0, date_fns_1.add)(zonedJobIntervalStartedAt, interval);
        return (0, date_fns_tz_1.zonedTimeToUtc)(zonedJobIntervalEndedAt, timezone);
    }
    if (typeof interval === "string") {
        try {
            const expression = (0, cron_parser_1.parseExpression)(interval, { currentDate: date, tz: timezone });
            return expression.next().toDate();
        }
        catch (error) {
            throw new Error(`Cannot parse cron expression for ${interval}`);
        }
    }
    return (0, date_fns_1.addMilliseconds)(date, interval);
}
exports.addInterval = addInterval;
/**
 * @internal
 */
function subInterval(date, interval, timezone) {
    if (isDuration(interval)) {
        const zonedJobIntervalEndedAt = (0, date_fns_tz_1.utcToZonedTime)(date, timezone);
        const zonedJobIntervalStartedAt = (0, date_fns_1.sub)(zonedJobIntervalEndedAt, interval);
        return (0, date_fns_tz_1.zonedTimeToUtc)(zonedJobIntervalStartedAt, timezone);
    }
    if (typeof interval === "string") {
        try {
            const expression = (0, cron_parser_1.parseExpression)(interval, { currentDate: date, tz: timezone });
            return expression.prev().toDate();
        }
        catch (error) {
            throw new Error(`Cannot parse cron expression for ${interval}`);
        }
    }
    return (0, date_fns_1.subMilliseconds)(date, interval);
}
exports.subInterval = subInterval;
/**
 * @internal
 */
function getLastDeactivatedJobIntervalEndedAt(lastJobLock) {
    return lastJobLock.isActive
        ? (0, date_fns_1.subMilliseconds)(lastJobLock.jobIntervalEndedAt, lastJobLock.jobInterval)
        : lastJobLock.jobIntervalEndedAt;
}
exports.getLastDeactivatedJobIntervalEndedAt = getLastDeactivatedJobIntervalEndedAt;
/**
 * @internal
 */
function hasErrorCode(error) {
    return error instanceof Error && typeof error.code === "string";
}
exports.hasErrorCode = hasErrorCode;
/**
 * @internal
 */
function log(formatter, ...args) {
    logCronyx(formatter, ...args);
}
exports.log = log;
//# sourceMappingURL=util.js.map