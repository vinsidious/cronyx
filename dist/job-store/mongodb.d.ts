/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import type { ConnectOptions, Types } from "mongoose";
import type BaseJobStore from ".";
import type MongodbJobLock from "../job-lock/mongodb";
/**
 * @public
 */
export default class MongodbJobStore implements BaseJobStore<Types.ObjectId> {
    #private;
    static connect(url: string, options?: ConnectOptions): Promise<MongodbJobStore>;
    sync(): Promise<void>;
    close(): Promise<void>;
    fetchLastJobLock(jobName: string): Promise<MongodbJobLock | null>;
    activateJobLock(jobName: string, jobInterval: number, jobIntervalEndedAt: Date, retryIntervalStartedAt: Date): Promise<MongodbJobLock | null>;
    deactivateJobLock(jobName: string, jobId: Types.ObjectId): Promise<MongodbJobLock>;
    removeJobLock(jobName: string, jobId: Types.ObjectId): Promise<void>;
}
//# sourceMappingURL=mongodb.d.ts.map