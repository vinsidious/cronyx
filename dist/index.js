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
var _Cronyx_jobStore, _Cronyx_timezone;
import JobRunner from "./job-runner.js";
export { mongodbJobLockSchema } from "./job-lock/mongodb.js";
export { TypeormJobLockEntity } from "./job-lock/typeorm.js";
export { default as MongodbJobStore } from "./job-store/mongodb.js";
export { default as RedisJobStore } from "./job-store/redis.js";
export { default as TypeormJobStore } from "./job-store/typeorm/index.js";
export { default as MysqlJobStore } from "./job-store/typeorm/mysql.js";
export { default as PostgresJobStore } from "./job-store/typeorm/postgres.js";
export { default as Job } from "./job.js";
export { CronyxError, CronyxArgumentError, CronyxNotFoundError } from "./error.js";
/**
 * @public
 */
class Cronyx {
    constructor(options) {
        _Cronyx_jobStore.set(this, void 0);
        _Cronyx_timezone.set(this, void 0);
        __classPrivateFieldSet(this, _Cronyx_jobStore, options.jobStore, "f");
        __classPrivateFieldSet(this, _Cronyx_timezone, options.timezone, "f");
    }
    async requestJobExec(options, task) {
        const jobRunner = new JobRunner(__classPrivateFieldGet(this, _Cronyx_jobStore, "f"), options.jobName, options.jobInterval, {
            timezone: options.timezone ?? __classPrivateFieldGet(this, _Cronyx_timezone, "f"),
            requiredJobNames: options.requiredJobNames,
            startBuffer: options.startBuffer,
            retryInterval: options.retryInterval,
            noLock: options.noLock,
            jobIntervalStartedAt: options.jobIntervalStartedAt,
        });
        return await jobRunner.requestJobExec(task);
    }
    async requestJobStart(options) {
        const jobRunner = new JobRunner(__classPrivateFieldGet(this, _Cronyx_jobStore, "f"), options.jobName, options.jobInterval, {
            timezone: options.timezone ?? __classPrivateFieldGet(this, _Cronyx_timezone, "f"),
            requiredJobNames: options.requiredJobNames,
            startBuffer: options.startBuffer,
            retryInterval: options.retryInterval,
            noLock: options.noLock,
            jobIntervalStartedAt: options.jobIntervalStartedAt,
        });
        return await jobRunner.requestJobStart();
    }
}
_Cronyx_jobStore = new WeakMap(), _Cronyx_timezone = new WeakMap();
export default Cronyx;
//# sourceMappingURL=index.js.map