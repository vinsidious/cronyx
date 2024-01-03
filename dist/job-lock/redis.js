import { v4 } from "uuid";
import { z } from "zod";
/**
 * @public
 */
const RedisJobLock = z.object({
    _id: z
        .string()
        .uuid()
        .default(() => v4()),
    jobName: z.string(),
    jobInterval: z.number().default(0),
    jobIntervalEndedAt: z.coerce.date(),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});
export default RedisJobLock;
//# sourceMappingURL=redis.js.map