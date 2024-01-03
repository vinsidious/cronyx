/**
 * @public
 */
export class CronyxError extends Error {
    /**
     * @internal
     */
    constructor(message, options) {
        super(message, options);
        this.name = this.constructor.name;
    }
    /**
     * @internal
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
/**
 * @public
 */
export class CronyxArgumentError extends CronyxError {
}
/**
 * @public
 */
export class CronyxNotFoundError extends CronyxError {
}
//# sourceMappingURL=error.js.map