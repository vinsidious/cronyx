"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodbJobLockSchema = void 0;
const mongoose_1 = require("mongoose");
/**
 * @internal
 */
exports.mongodbJobLockSchema = new mongoose_1.Schema({
    jobName: { type: String, required: true },
    jobInterval: { type: Number, required: true, default: 0 },
    jobIntervalEndedAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
}).index({ jobName: 1, jobIntervalEndedAt: 1 }, { unique: true });
//# sourceMappingURL=mongodb.js.map