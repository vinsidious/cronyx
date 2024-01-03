import type BaseJobLock from "../job-lock/index.js";

/**
 * @public
 */
export default interface BaseJobStore<I> {
  close(): Promise<void>;
  sync(): Promise<void>;
  fetchLastJobLock(jobName: string): Promise<BaseJobLock<I> | null>;
  activateJobLock(
    jobName: string,
    jobInterval: number,
    jobIntervalEndedAt: Date,
    retryIntervalStartedAt: Date,
  ): Promise<BaseJobLock<I> | null>;
  deactivateJobLock(jobName: string, jobId: I): Promise<BaseJobLock<I>>;
  removeJobLock(jobName: string, jobId: I): Promise<void>;
}
