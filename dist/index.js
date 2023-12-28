"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronyxNotFoundError = exports.CronyxArgumentError = exports.CronyxError = exports.Job = exports.PostgresJobStore = exports.MysqlJobStore = exports.TypeormJobStore = exports.RedisJobStore = exports.MongodbJobStore = exports.TypeormJobLockEntity = exports.mongodbJobLockSchema = void 0;
const job_runner_1 = require("./job-runner");
var mongodb_1 = require("./job-lock/mongodb");
Object.defineProperty(exports, "mongodbJobLockSchema", { enumerable: true, get: function () { return mongodb_1.mongodbJobLockSchema; } });
var typeorm_1 = require("./job-lock/typeorm");
Object.defineProperty(exports, "TypeormJobLockEntity", { enumerable: true, get: function () { return typeorm_1.TypeormJobLockEntity; } });
var mongodb_2 = require("./job-store/mongodb");
Object.defineProperty(exports, "MongodbJobStore", { enumerable: true, get: function () { return mongodb_2.default; } });
var redis_1 = require("./job-store/redis");
Object.defineProperty(exports, "RedisJobStore", { enumerable: true, get: function () { return redis_1.default; } });
var typeorm_2 = require("./job-store/typeorm");
Object.defineProperty(exports, "TypeormJobStore", { enumerable: true, get: function () { return typeorm_2.default; } });
var mysql_1 = require("./job-store/typeorm/mysql");
Object.defineProperty(exports, "MysqlJobStore", { enumerable: true, get: function () { return mysql_1.default; } });
var postgres_1 = require("./job-store/typeorm/postgres");
Object.defineProperty(exports, "PostgresJobStore", { enumerable: true, get: function () { return postgres_1.default; } });
var job_1 = require("./job");
Object.defineProperty(exports, "Job", { enumerable: true, get: function () { return job_1.default; } });
var error_1 = require("./error");
Object.defineProperty(exports, "CronyxError", { enumerable: true, get: function () { return error_1.CronyxError; } });
Object.defineProperty(exports, "CronyxArgumentError", { enumerable: true, get: function () { return error_1.CronyxArgumentError; } });
Object.defineProperty(exports, "CronyxNotFoundError", { enumerable: true, get: function () { return error_1.CronyxNotFoundError; } });
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
        const jobRunner = new job_runner_1.default(__classPrivateFieldGet(this, _Cronyx_jobStore, "f"), options.jobName, options.jobInterval, {
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
        const jobRunner = new job_runner_1.default(__classPrivateFieldGet(this, _Cronyx_jobStore, "f"), options.jobName, options.jobInterval, {
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
exports.default = Cronyx;
//# sourceMappingURL=index.js.map