import type { Duration } from "date-fns";
import type Job from "./job";
import type BaseJobStore from "./job-store";
export type { default as BaseJobLock } from "./job-lock";
export type { default as MongodbJobLock } from "./job-lock/mongodb";
export type { default as RedisJobLock } from "./job-lock/redis";
export type { default as TypeormJobLock } from "./job-lock/typeorm";
export type { default as BaseJobStore } from "./job-store";
export { mongodbJobLockSchema } from "./job-lock/mongodb";
export { TypeormJobLockEntity } from "./job-lock/typeorm";
export { default as MongodbJobStore } from "./job-store/mongodb";
export { default as RedisJobStore } from "./job-store/redis";
export { default as TypeormJobStore } from "./job-store/typeorm";
export { default as MysqlJobStore } from "./job-store/typeorm/mysql";
export { default as PostgresJobStore } from "./job-store/typeorm/postgres";
export { default as Job } from "./job";
export { CronyxError, CronyxArgumentError, CronyxNotFoundError } from "./error";
/**
 * @public
 */
export type JobLockId<S> = S extends BaseJobStore<infer I> ? I : never;
/**
 * @public
 */
export type CronyxOptions<S extends BaseJobStore<unknown>> = {
    jobStore: S;
    timezone?: string;
};
/**
 * @public
 */
export type BaseRequestJobOptions = {
    jobName: string;
    jobInterval: Duration | string | number;
    startBuffer?: Duration | number;
    retryInterval?: Duration | number;
    requiredJobNames?: string[];
    timezone?: string;
};
/**
 * @public
 */
export type RequestJobOptions = (BaseRequestJobOptions & {
    noLock: true;
    jobIntervalStartedAt: Date;
}) | (BaseRequestJobOptions & {
    noLock?: boolean;
    jobIntervalStartedAt?: never;
});
/**
 * @public
 */
export default class Cronyx<S extends BaseJobStore<I>, I = JobLockId<S>> {
    #private;
    constructor(options: CronyxOptions<S>);
    requestJobExec(options: RequestJobOptions, task: (job: Job<I>) => Promise<void>): Promise<void>;
    requestJobStart(options: RequestJobOptions): Promise<Job<I> | null>;
}
//# sourceMappingURL=index.d.ts.map