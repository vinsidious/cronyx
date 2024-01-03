import { z } from "zod";
/**
 * @internal
 */
const MockJobLock = z.object({
    _id: z.null().optional().default(null),
    jobName: z.string(),
    jobInterval: z.number().default(0),
    jobIntervalEndedAt: z.coerce.date(),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});
export default MockJobLock;
//# sourceMappingURL=mock.js.map