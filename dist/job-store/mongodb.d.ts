/// <reference types="mongoose/types/aggregate.js" />
/// <reference types="mongoose/types/callback.js" />
/// <reference types="mongoose/types/collection.js" />
/// <reference types="mongoose/types/connection.js" />
/// <reference types="mongoose/types/cursor.js" />
/// <reference types="mongoose/types/document.js" />
/// <reference types="mongoose/types/error.js" />
/// <reference types="mongoose/types/expressions.js" />
/// <reference types="mongoose/types/helpers.js" />
/// <reference types="mongoose/types/middlewares.js" />
/// <reference types="mongoose/types/indexes.js" />
/// <reference types="mongoose/types/models.js" />
/// <reference types="mongoose/types/mongooseoptions.js" />
/// <reference types="mongoose/types/pipelinestage.js" />
/// <reference types="mongoose/types/populate.js" />
/// <reference types="mongoose/types/query.js" />
/// <reference types="mongoose/types/schemaoptions.js" />
/// <reference types="mongoose/types/schematypes.js" />
/// <reference types="mongoose/types/session.js" />
/// <reference types="mongoose/types/types.js" />
/// <reference types="mongoose/types/utility.js" />
/// <reference types="mongoose/types/validation.js" />
/// <reference types="mongoose/types/virtuals.js" />
/// <reference types="mongoose/types/inferschematype.js" />
import type { ConnectOptions, Types } from "mongoose";
import type BaseJobStore from "./index.js";
import type MongodbJobLock from "../job-lock/mongodb.js";
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