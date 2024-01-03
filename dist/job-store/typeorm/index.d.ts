import type BaseJobStore from "../index.js";
import type TypeormJobLock from "../../job-lock/typeorm.js";
/**
 * @public
 */
export default abstract class TypeormJobStore implements BaseJobStore<string> {
    #private;
    protected abstract uniqueConstraintErrorCode: string;
    sync(): Promise<void>;
    close(): Promise<void>;
    fetchLastJobLock(jobName: string): Promise<TypeormJobLock | null>;
    activateJobLock(jobName: string, jobInterval: number, jobIntervalEndedAt: Date, retryIntervalStartedAt: Date): Promise<TypeormJobLock | null>;
    deactivateJobLock(jobName: string, jobId: string): Promise<TypeormJobLock>;
    removeJobLock(jobName: string, jobId: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map