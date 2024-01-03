import { RedisClientOptions } from "redis";
import type BaseJobStore from "./index.js";
import RedisJobLock from "../job-lock/redis.js";
/**
 * @public
 */
export default class RedisJobStore implements BaseJobStore<string> {
    #private;
    static connect(options: RedisClientOptions): Promise<RedisJobStore>;
    sync(): Promise<void>;
    close(): Promise<void>;
    fetchLastJobLock(jobName: string): Promise<RedisJobLock | null>;
    activateJobLock(jobName: string, jobInterval: number, jobIntervalEndedAt: Date, retryIntervalStartedAt: Date): Promise<RedisJobLock | null>;
    deactivateJobLock(jobName: string, jobId: string): Promise<RedisJobLock>;
    removeJobLock(jobName: string, jobId: string): Promise<void>;
}
//# sourceMappingURL=redis.d.ts.map