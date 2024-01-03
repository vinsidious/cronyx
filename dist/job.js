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
var _Job_jobName, _Job_jobStore, _Job_jobLock, _Job_pendingPromise;
import { subMilliseconds } from "date-fns";
import { CronyxError } from "./error.js";
import { log } from "./util.js";
/**
 * @public
 */
class Job {
    /**
     * @internal
     */
    constructor(jobStore, jobLock) {
        _Job_jobName.set(this, void 0);
        _Job_jobStore.set(this, void 0);
        _Job_jobLock.set(this, void 0);
        _Job_pendingPromise.set(this, null);
        __classPrivateFieldSet(this, _Job_jobName, jobLock.jobName, "f");
        __classPrivateFieldSet(this, _Job_jobStore, jobStore, "f");
        __classPrivateFieldSet(this, _Job_jobLock, jobLock, "f");
    }
    get id() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f")._id;
    }
    get name() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f").jobName;
    }
    get interval() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f").jobInterval;
    }
    get intervalStartedAt() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return subMilliseconds(__classPrivateFieldGet(this, _Job_jobLock, "f").jobIntervalEndedAt, __classPrivateFieldGet(this, _Job_jobLock, "f").jobInterval);
    }
    get intervalEndedAt() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f").jobIntervalEndedAt;
    }
    get isActive() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return true;
    }
    get createdAt() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f").createdAt;
    }
    get updatedAt() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        return __classPrivateFieldGet(this, _Job_jobLock, "f").updatedAt;
    }
    async finish() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        if (__classPrivateFieldGet(this, _Job_pendingPromise, "f"))
            throw new CronyxError(`Job is pending for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        if (__classPrivateFieldGet(this, _Job_jobLock, "f")._id === null) {
            __classPrivateFieldSet(this, _Job_jobLock, { ...__classPrivateFieldGet(this, _Job_jobLock, "f"), isActive: false }, "f");
            return;
        }
        __classPrivateFieldSet(this, _Job_pendingPromise, __classPrivateFieldGet(this, _Job_jobStore, "f")
            .deactivateJobLock(__classPrivateFieldGet(this, _Job_jobLock, "f").jobName, __classPrivateFieldGet(this, _Job_jobLock, "f")._id)
            .then((jobLock) => {
            log(`Job is finished for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
            __classPrivateFieldSet(this, _Job_jobLock, jobLock, "f");
            __classPrivateFieldSet(this, _Job_pendingPromise, null, "f");
        })
            .catch((error) => {
            __classPrivateFieldSet(this, _Job_pendingPromise, null, "f");
            throw new CronyxError(`Cannot finish job for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`, { cause: error });
        }), "f");
        return __classPrivateFieldGet(this, _Job_pendingPromise, "f");
    }
    async interrupt() {
        if (!__classPrivateFieldGet(this, _Job_jobLock, "f") || !__classPrivateFieldGet(this, _Job_jobLock, "f").isActive)
            throw new CronyxError(`Job is not active for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        if (__classPrivateFieldGet(this, _Job_pendingPromise, "f"))
            throw new CronyxError(`Job is pending for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
        if (__classPrivateFieldGet(this, _Job_jobLock, "f")._id === null) {
            __classPrivateFieldSet(this, _Job_jobLock, null, "f");
            return;
        }
        __classPrivateFieldSet(this, _Job_pendingPromise, __classPrivateFieldGet(this, _Job_jobStore, "f")
            .removeJobLock(__classPrivateFieldGet(this, _Job_jobLock, "f").jobName, __classPrivateFieldGet(this, _Job_jobLock, "f")._id)
            .then(() => {
            log(`Job is interrupted for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`);
            __classPrivateFieldSet(this, _Job_jobLock, null, "f");
            __classPrivateFieldSet(this, _Job_pendingPromise, null, "f");
        })
            .catch((error) => {
            __classPrivateFieldSet(this, _Job_pendingPromise, null, "f");
            throw new CronyxError(`Cannot interrupt job for ${__classPrivateFieldGet(this, _Job_jobName, "f")}`, { cause: error });
        }), "f");
        return __classPrivateFieldGet(this, _Job_pendingPromise, "f");
    }
}
_Job_jobName = new WeakMap(), _Job_jobStore = new WeakMap(), _Job_jobLock = new WeakMap(), _Job_pendingPromise = new WeakMap();
export default Job;
//# sourceMappingURL=job.js.map