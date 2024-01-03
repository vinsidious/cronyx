import { Schema } from "mongoose";
/**
 * @internal
 */
export const mongodbJobLockSchema = new Schema({
    jobName: { type: String, required: true },
    jobInterval: { type: Number, required: true, default: 0 },
    jobIntervalEndedAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
}).index({ jobName: 1, jobIntervalEndedAt: 1 }, { unique: true });
//# sourceMappingURL=mongodb.js.map