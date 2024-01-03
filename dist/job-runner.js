var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JobRunner_instances, _JobRunner_jobStore, _JobRunner_timezone, _JobRunner_jobName, _JobRunner_jobInterval, _JobRunner_requiredJobNames, _JobRunner_startBuffer, _JobRunner_retryInterval, _JobRunner_noLock, _JobRunner_jobIntervalStartedAt, _JobRunner_ensureLastJobLock, _JobRunner_areRequiredJobsFulfilled;
import { differenceInMilliseconds, min } from "date-fns";
import { CronyxArgumentError, CronyxError } from "./error.js";
import Job from "./job.js";
import MockJobLock from "./job-lock/mock.js";
import { addInterval, getLastDeactivatedJobIntervalEndedAt, log, subInterval } from "./util.js";
/**
 * @internal
 */
class JobRunner {
    constructor(jobStore, jobName, jobInterval, options) {
        _JobRunner_instances.add(this);
        _JobRunner_jobStore.set(this, void 0);
        _JobRunner_timezone.set(this, void 0);
        _JobRunner_jobName.set(this, void 0);
        _JobRunner_jobInterval.set(this, void 0);
        _JobRunner_requiredJobNames.set(this, void 0);
        _JobRunner_startBuffer.set(this, void 0);
        _JobRunner_retryInterval.set(this, void 0);
        _JobRunner_noLock.set(this, void 0);
        _JobRunner_jobIntervalStartedAt.set(this, void 0);
        __classPrivateFieldSet(this, _JobRunner_jobStore, jobStore, "f");
        __classPrivateFieldSet(this, _JobRunner_jobName, jobName, "f");
        __classPrivateFieldSet(this, _JobRunner_jobInterval, jobInterval, "f");
        __classPrivateFieldSet(this, _JobRunner_timezone, options?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone, "f");
        __classPrivateFieldSet(this, _JobRunner_requiredJobNames, options?.requiredJobNames ?? [], "f");
        __classPrivateFieldSet(this, _JobRunner_startBuffer, options?.startBuffer ?? 0, "f");
        __classPrivateFieldSet(this, _JobRunner_retryInterval, options?.retryInterval, "f");
        __classPrivateFieldSet(this, _JobRunner_noLock, options?.noLock ?? false, "f");
        __classPrivateFieldSet(this, _JobRunner_jobIntervalStartedAt, options?.jobIntervalStartedAt, "f");
    }
    async requestJobExec(task) {
        const job = await this.requestJobStart();
        if (!job)
            return;
        try {
            await task(job);
        }
        catch (error) {
            await job.interrupt();
            throw error;
        }
        await job.finish();
    }
    async requestJobStart() {
        const requestedAt = new Date();
        const bufferedRequestedAt = subInterval(requestedAt, __classPrivateFieldGet(this, _JobRunner_startBuffer, "f"), __classPrivateFieldGet(this, _JobRunner_timezone, "f"));
        if (__classPrivateFieldGet(this, _JobRunner_jobIntervalStartedAt, "f")) {
            if (!__classPrivateFieldGet(this, _JobRunner_noLock, "f"))
                throw new CronyxArgumentError("Should enable `noLock` when `jobIntervalStartedAt` is passed");
            if (bufferedRequestedAt < __classPrivateFieldGet(this, _JobRunner_jobIntervalStartedAt, "f")) {
                log(`Job is not reached to start time for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
                return null;
            }
            const maxJobIntervalEndedAt = addInterval(__classPrivateFieldGet(this, _JobRunner_jobIntervalStartedAt, "f"), __classPrivateFieldGet(this, _JobRunner_jobInterval, "f"), __classPrivateFieldGet(this, _JobRunner_timezone, "f"));
            const jobIntervalEndedAt = min([maxJobIntervalEndedAt, bufferedRequestedAt]);
            const jobInterval = differenceInMilliseconds(jobIntervalEndedAt, __classPrivateFieldGet(this, _JobRunner_jobIntervalStartedAt, "f"));
            const jobLock = MockJobLock.parse({ jobName: __classPrivateFieldGet(this, _JobRunner_jobName, "f"), jobInterval, jobIntervalEndedAt });
            log(`Job from ${__classPrivateFieldGet(this, _JobRunner_jobIntervalStartedAt, "f").toISOString()} to ${jobIntervalEndedAt.toISOString()} is started for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
            return new Job(__classPrivateFieldGet(this, _JobRunner_jobStore, "f"), jobLock);
        }
        const retryIntervalStartedAt = subInterval(requestedAt, __classPrivateFieldGet(this, _JobRunner_retryInterval, "f") ?? requestedAt.getTime(), __classPrivateFieldGet(this, _JobRunner_timezone, "f"));
        const lastJobLock = await __classPrivateFieldGet(this, _JobRunner_instances, "m", _JobRunner_ensureLastJobLock).call(this, requestedAt);
        if (lastJobLock.isActive && lastJobLock.updatedAt > retryIntervalStartedAt) {
            return null;
        }
        const jobIntervalStartedAt = getLastDeactivatedJobIntervalEndedAt(lastJobLock);
        const maxJobIntervalEndedAt = addInterval(jobIntervalStartedAt, __classPrivateFieldGet(this, _JobRunner_jobInterval, "f"), __classPrivateFieldGet(this, _JobRunner_timezone, "f"));
        if (lastJobLock._id !== null && bufferedRequestedAt < maxJobIntervalEndedAt) {
            log(`Job is not reached to start time for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
            return null;
        }
        const jobIntervalEndedAt = min([maxJobIntervalEndedAt, bufferedRequestedAt]);
        const areRequiredJobsFulfilled = await __classPrivateFieldGet(this, _JobRunner_instances, "m", _JobRunner_areRequiredJobsFulfilled).call(this, jobIntervalEndedAt);
        if (!areRequiredJobsFulfilled) {
            return null;
        }
        const jobInterval = differenceInMilliseconds(jobIntervalEndedAt, jobIntervalStartedAt);
        if (__classPrivateFieldGet(this, _JobRunner_noLock, "f")) {
            const jobLock = MockJobLock.parse({ jobName: __classPrivateFieldGet(this, _JobRunner_jobName, "f"), jobInterval, jobIntervalEndedAt });
            return new Job(__classPrivateFieldGet(this, _JobRunner_jobStore, "f"), jobLock);
        }
        let jobLock;
        try {
            jobLock = await __classPrivateFieldGet(this, _JobRunner_jobStore, "f").activateJobLock(__classPrivateFieldGet(this, _JobRunner_jobName, "f"), jobInterval, jobIntervalEndedAt, retryIntervalStartedAt);
        }
        catch (error) {
            throw new CronyxError(`Cannot activate job lock for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`, { cause: error });
        }
        if (!jobLock) {
            log(`Job is currently active for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
            return null;
        }
        log(`Job from ${jobIntervalStartedAt} to ${jobIntervalEndedAt} is started for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
        return new Job(__classPrivateFieldGet(this, _JobRunner_jobStore, "f"), jobLock);
    }
}
_JobRunner_jobStore = new WeakMap(), _JobRunner_timezone = new WeakMap(), _JobRunner_jobName = new WeakMap(), _JobRunner_jobInterval = new WeakMap(), _JobRunner_requiredJobNames = new WeakMap(), _JobRunner_startBuffer = new WeakMap(), _JobRunner_retryInterval = new WeakMap(), _JobRunner_noLock = new WeakMap(), _JobRunner_jobIntervalStartedAt = new WeakMap(), _JobRunner_instances = new WeakSet(), _JobRunner_ensureLastJobLock = async function _JobRunner_ensureLastJobLock(requestedAt) {
    let lastJobLock;
    try {
        lastJobLock = await __classPrivateFieldGet(this, _JobRunner_jobStore, "f").fetchLastJobLock(__classPrivateFieldGet(this, _JobRunner_jobName, "f"));
    }
    catch (error) {
        throw new CronyxError(`Cannot find last job lock for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`, { cause: error });
    }
    if (lastJobLock) {
        return lastJobLock;
    }
    try {
        const jobIntervalEndedAt = subInterval(requestedAt, __classPrivateFieldGet(this, _JobRunner_jobInterval, "f"), __classPrivateFieldGet(this, _JobRunner_timezone, "f"));
        return MockJobLock.parse({ jobName: __classPrivateFieldGet(this, _JobRunner_jobName, "f"), jobIntervalEndedAt, isActive: false });
    }
    catch (error) {
        throw new CronyxError(`Cannot create job lock for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`, { cause: error });
    }
}, _JobRunner_areRequiredJobsFulfilled = async function _JobRunner_areRequiredJobsFulfilled(jobIntervalEndedAt) {
    for (const requiredJobName of __classPrivateFieldGet(this, _JobRunner_requiredJobNames, "f")) {
        let requiredJobLock;
        try {
            requiredJobLock = await __classPrivateFieldGet(this, _JobRunner_jobStore, "f").fetchLastJobLock(requiredJobName);
        }
        catch (error) {
            throw new CronyxError(`Cannot find required job lock for ${requiredJobName}`, { cause: error });
        }
        if (!requiredJobLock) {
            log(`Required jobs ${requiredJobName} is not fulfilled for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
            return false;
        }
        const requiredJobIntervalEndedAt = getLastDeactivatedJobIntervalEndedAt(requiredJobLock);
        if (requiredJobIntervalEndedAt < jobIntervalEndedAt) {
            log(`Required jobs ${requiredJobName} is not fulfilled for ${__classPrivateFieldGet(this, _JobRunner_jobName, "f")}`);
            return false;
        }
    }
    return true;
};
export default JobRunner;
//# sourceMappingURL=job-runner.js.map