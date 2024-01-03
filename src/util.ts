import { add, addMilliseconds, Duration, sub, subMilliseconds } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import debug from "debug";
import type BaseJobLock from "./job-lock/index.js";

const DURATION_KEYS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

const logCronyx = debug("cronyx");

/**
 * @internal
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * @internal
 */
export function isDuration(obj: unknown): obj is Duration {
  if (typeof obj !== "object" || obj === null) return false;

  for (const key in obj) {
    if (!DURATION_KEYS.includes(key)) return false;

    const value = (obj as Record<string, unknown>)[key];
    if (value !== undefined && typeof value !== "number") return false;
  }

  return true;
}

/**
 * @internal
 */
export function addInterval(date: Date, interval: Duration | number, timezone: string): Date {
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
export function subInterval(date: Date, interval: Duration | number, timezone: string): Date {
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
export function getLastDeactivatedJobIntervalEndedAt<I>(lastJobLock: BaseJobLock<I>) {
  return lastJobLock.isActive
    ? subMilliseconds(lastJobLock.jobIntervalEndedAt, lastJobLock.jobInterval)
    : lastJobLock.jobIntervalEndedAt;
}

/**
 * @internal
 */
export function hasErrorCode(error: unknown): error is Error & { code: string } {
  return error instanceof Error && typeof (error as Error & { code?: string }).code === "string";
}

/**
 * @internal
 */
export function log(formatter: unknown, ...args: unknown[]) {
  logCronyx(formatter, ...args);
}
