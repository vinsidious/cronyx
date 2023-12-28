/**
 * @public
 */
export default class Job<I> {
    #private;
    get id(): I | null;
    get name(): string;
    get interval(): number;
    get intervalStartedAt(): Date;
    get intervalEndedAt(): Date;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    finish(): Promise<void>;
    interrupt(): Promise<void>;
}
//# sourceMappingURL=job.d.ts.map