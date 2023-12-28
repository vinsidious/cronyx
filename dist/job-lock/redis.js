"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const zod_1 = require("zod");
/**
 * @public
 */
const RedisJobLock = zod_1.z.object({
    _id: zod_1.z
        .string()
        .uuid()
        .default(() => (0, uuid_1.v4)()),
    jobName: zod_1.z.string(),
    jobInterval: zod_1.z.number().default(0),
    jobIntervalEndedAt: zod_1.z.coerce.date(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.coerce.date().default(() => new Date()),
    updatedAt: zod_1.z.coerce.date().default(() => new Date()),
});
exports.default = RedisJobLock;
//# sourceMappingURL=redis.js.map