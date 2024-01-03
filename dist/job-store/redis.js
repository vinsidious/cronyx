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
var _RedisJobStore_instances, _RedisJobStore_client, _RedisJobStore_getActiveJobLock;
import { isEqual } from "date-fns";
import { createClient, WatchError } from "redis";
import { CronyxNotFoundError } from "../error.js";
import RedisJobLock from "../job-lock/redis.js";
const ACTIVE_JOB_LOCK_PREFIX = "joblocks:active:";
const JOB_LOCK_PREFIX = "joblocks:";
/**
 * @public
 */
class RedisJobStore {
    /**
     * @internal
     */
    constructor(client) {
        _RedisJobStore_instances.add(this);
        _RedisJobStore_client.set(this, void 0);
        __classPrivateFieldSet(this, _RedisJobStore_client, client, "f");
    }
    static async connect(options) {
        const client = createClient(options);
        await client.connect();
        return new RedisJobStore(client);
    }
    async sync() {
        // Do nothing
    }
    async close() {
        await __classPrivateFieldGet(this, _RedisJobStore_client, "f").quit();
    }
    async fetchLastJobLock(jobName) {
        const [activeJobLockJson, jobLockJson] = (await __classPrivateFieldGet(this, _RedisJobStore_client, "f")
            .multi()
            .get(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`)
            .get(`${JOB_LOCK_PREFIX}${jobName}`)
            .exec());
        if (activeJobLockJson) {
            return RedisJobLock.parse(JSON.parse(activeJobLockJson));
        }
        if (jobLockJson) {
            return RedisJobLock.parse(JSON.parse(jobLockJson));
        }
        return null;
    }
    async activateJobLock(jobName, jobInterval, jobIntervalEndedAt, retryIntervalStartedAt) {
        try {
            return await __classPrivateFieldGet(this, _RedisJobStore_client, "f").executeIsolated(async (isolatedClient) => {
                const now = new Date();
                const multi = isolatedClient.multi();
                await isolatedClient.watch([`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`, `${JOB_LOCK_PREFIX}${jobName}`]);
                try {
                    const lastJobLock = await this.fetchLastJobLock(jobName);
                    if (lastJobLock) {
                        if (lastJobLock.isActive) {
                            if (lastJobLock.updatedAt <= retryIntervalStartedAt) {
                                const reactivatedJobLock = { ...lastJobLock, jobInterval, updatedAt: now };
                                multi.set(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`, JSON.stringify(reactivatedJobLock));
                                return reactivatedJobLock;
                            }
                            return null;
                        }
                        if (isEqual(lastJobLock.jobIntervalEndedAt, jobIntervalEndedAt)) {
                            return null;
                        }
                    }
                    const activatedJobLock = RedisJobLock.parse({
                        jobName,
                        jobIntervalEndedAt,
                        jobInterval,
                    });
                    multi.set(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`, JSON.stringify(activatedJobLock));
                    return activatedJobLock;
                }
                finally {
                    await multi.exec();
                }
            });
        }
        catch (error) {
            if (error instanceof WatchError) {
                return null;
            }
            throw error;
        }
    }
    async deactivateJobLock(jobName, jobId) {
        const activeJobLock = await __classPrivateFieldGet(this, _RedisJobStore_instances, "m", _RedisJobStore_getActiveJobLock).call(this, jobName);
        if (!activeJobLock || activeJobLock._id !== jobId) {
            throw new CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
        }
        const detivatedJobLock = { ...activeJobLock, isActive: false, updatedAt: new Date() };
        await __classPrivateFieldGet(this, _RedisJobStore_client, "f")
            .multi()
            .set(`${JOB_LOCK_PREFIX}${jobName}`, JSON.stringify(detivatedJobLock))
            .del(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`)
            .exec();
        return detivatedJobLock;
    }
    async removeJobLock(jobName, jobId) {
        const activeJobLock = await __classPrivateFieldGet(this, _RedisJobStore_instances, "m", _RedisJobStore_getActiveJobLock).call(this, jobName);
        if (!activeJobLock || activeJobLock._id !== jobId) {
            throw new CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
        }
        await __classPrivateFieldGet(this, _RedisJobStore_client, "f").del(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`);
    }
}
_RedisJobStore_client = new WeakMap(), _RedisJobStore_instances = new WeakSet(), _RedisJobStore_getActiveJobLock = async function _RedisJobStore_getActiveJobLock(jobName) {
    const activeJobLockJson = await __classPrivateFieldGet(this, _RedisJobStore_client, "f").get(`${ACTIVE_JOB_LOCK_PREFIX}${jobName}`);
    if (!activeJobLockJson)
        return null;
    return RedisJobLock.parse(JSON.parse(activeJobLockJson));
};
export default RedisJobStore;
//# sourceMappingURL=redis.js.map