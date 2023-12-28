"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/**
 * @internal
 */
const MockJobLock = zod_1.z.object({
    _id: zod_1.z.null().optional().default(null),
    jobName: zod_1.z.string(),
    jobInterval: zod_1.z.number().default(0),
    jobIntervalEndedAt: zod_1.z.coerce.date(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.coerce.date().default(() => new Date()),
    updatedAt: zod_1.z.coerce.date().default(() => new Date()),
});
exports.default = MockJobLock;
//# sourceMappingURL=mock.js.map