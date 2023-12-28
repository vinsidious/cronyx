import { z } from "zod";
/**
 * @public
 */
declare const RedisJobLock: z.ZodObject<{
    _id: z.ZodDefault<z.ZodString>;
    jobName: z.ZodString;
    jobInterval: z.ZodDefault<z.ZodNumber>;
    jobIntervalEndedAt: z.ZodDate;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    _id: string;
    jobInterval: number;
    createdAt: Date;
    updatedAt: Date;
    jobName: string;
    jobIntervalEndedAt: Date;
}, {
    jobName: string;
    jobIntervalEndedAt: Date;
    _id?: string | undefined;
    jobInterval?: number | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
/**
 * @public
 */
type RedisJobLock = Required<z.infer<typeof RedisJobLock>>;
export default RedisJobLock;
//# sourceMappingURL=redis.d.ts.map