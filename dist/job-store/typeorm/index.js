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
var _TypeormJobStore_dataSource, _TypeormJobStore_repository;
import { CronyxNotFoundError } from "../../error.js";
import { TypeormJobLockEntity } from "../../job-lock/typeorm.js";
import { hasErrorCode } from "../../util.js";
/**
 * @public
 */
class TypeormJobStore {
    /**
     * @internal
     */
    constructor(dataSource) {
        _TypeormJobStore_dataSource.set(this, void 0);
        _TypeormJobStore_repository.set(this, void 0);
        __classPrivateFieldSet(this, _TypeormJobStore_dataSource, dataSource, "f");
        __classPrivateFieldSet(this, _TypeormJobStore_repository, dataSource.getRepository(TypeormJobLockEntity), "f");
    }
    async sync() {
        await __classPrivateFieldGet(this, _TypeormJobStore_dataSource, "f").synchronize();
    }
    async close() {
        await __classPrivateFieldGet(this, _TypeormJobStore_dataSource, "f").destroy();
    }
    async fetchLastJobLock(jobName) {
        return await __classPrivateFieldGet(this, _TypeormJobStore_repository, "f").findOne({
            where: { jobName },
            order: { jobIntervalEndedAt: -1 },
        });
    }
    async activateJobLock(jobName, jobInterval, jobIntervalEndedAt, retryIntervalStartedAt) {
        return await __classPrivateFieldGet(this, _TypeormJobStore_repository, "f").manager.transaction(async (transactionalEntityManager) => {
            const now = new Date();
            const activeJobLock = await transactionalEntityManager.findOne(TypeormJobLockEntity, {
                where: { jobName, jobIntervalEndedAt, isActive: true },
            });
            if (activeJobLock) {
                if (activeJobLock.updatedAt <= retryIntervalStartedAt) {
                    activeJobLock.jobInterval = jobInterval;
                    activeJobLock.updatedAt = now;
                    return await transactionalEntityManager.save(activeJobLock);
                }
                return null;
            }
            const activatedJobLock = transactionalEntityManager.create(TypeormJobLockEntity, {
                jobName,
                jobInterval,
                jobIntervalEndedAt,
                // NOTE
                // manually set createdAt and updatedAt to prevent integration tests
                // to fail due to default timestamp set on database instead of application
                createdAt: now,
                updatedAt: now,
            });
            try {
                return await transactionalEntityManager.save(activatedJobLock);
            }
            catch (error) {
                if (hasErrorCode(error) && error.code === this.uniqueConstraintErrorCode)
                    return null;
                throw error;
            }
        });
    }
    async deactivateJobLock(jobName, jobId) {
        const deactivatedJobLock = await __classPrivateFieldGet(this, _TypeormJobStore_repository, "f").findOne({ where: { _id: jobId, jobName, isActive: true } });
        if (!deactivatedJobLock)
            throw new CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
        return await __classPrivateFieldGet(this, _TypeormJobStore_repository, "f").save({ ...deactivatedJobLock, isActive: false, updatedAt: new Date() });
    }
    async removeJobLock(jobName, jobId) {
        const result = await __classPrivateFieldGet(this, _TypeormJobStore_repository, "f").delete({ _id: jobId, jobName, isActive: true });
        if (result.affected === 0)
            throw new CronyxNotFoundError(`Cannot find job lock for ${jobName}`);
    }
}
_TypeormJobStore_dataSource = new WeakMap(), _TypeormJobStore_repository = new WeakMap();
export default TypeormJobStore;
//# sourceMappingURL=index.js.map