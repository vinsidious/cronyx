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
var _MongodbJobStore_conn, _MongodbJobStore_model;
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const error_1 = require("../error");
const mongodb_2 = require("../job-lock/mongodb");
/**
 * @public
 */
class MongodbJobStore {
    /**
     * @internal
     */
    constructor(conn) {
        _MongodbJobStore_conn.set(this, void 0);
        _MongodbJobStore_model.set(this, void 0);
        __classPrivateFieldSet(this, _MongodbJobStore_conn, conn, "f");
        __classPrivateFieldSet(this, _MongodbJobStore_model, conn.model("JobLock", mongodb_2.mongodbJobLockSchema), "f");
    }
    static async connect(url, options) {
        const conn = (0, mongoose_1.createConnection)(url, options);
        await conn.asPromise();
        return new MongodbJobStore(conn);
    }
    async sync() {
        await __classPrivateFieldGet(this, _MongodbJobStore_conn, "f").syncIndexes();
    }
    async close() {
        await __classPrivateFieldGet(this, _MongodbJobStore_conn, "f").close();
    }
    async fetchLastJobLock(jobName) {
        return await __classPrivateFieldGet(this, _MongodbJobStore_model, "f").where({ jobName }).sort({ jobIntervalEndedAt: -1 }).findOne();
    }
    async activateJobLock(jobName, jobInterval, jobIntervalEndedAt, retryIntervalStartedAt) {
        try {
            return await __classPrivateFieldGet(this, _MongodbJobStore_model, "f").findOneAndUpdate({ jobName, jobIntervalEndedAt, isActive: true, updatedAt: { $lte: retryIntervalStartedAt } }, { jobInterval, updatedAt: new Date() }, { setDefaultsOnInsert: true, new: true, upsert: true });
        }
        catch (error) {
            if (error instanceof mongodb_1.MongoError && error.code === 11000) {
                return null;
            }
            throw error;
        }
    }
    async deactivateJobLock(jobName, jobId) {
        const deactivatedJobLock = await __classPrivateFieldGet(this, _MongodbJobStore_model, "f").findOneAndUpdate({ _id: jobId, jobName, isActive: true }, { isActive: false, updatedAt: new Date() }, { new: true });
        if (!deactivatedJobLock)
            throw new error_1.CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
        return deactivatedJobLock;
    }
    async removeJobLock(jobName, jobId) {
        const result = await __classPrivateFieldGet(this, _MongodbJobStore_model, "f").deleteOne({ _id: jobId, jobName, isActive: true });
        if (result.deletedCount === 0)
            throw new error_1.CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
    }
}
_MongodbJobStore_conn = new WeakMap(), _MongodbJobStore_model = new WeakMap();
exports.default = MongodbJobStore;
//# sourceMappingURL=mongodb.js.map