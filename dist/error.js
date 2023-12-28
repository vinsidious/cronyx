"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronyxNotFoundError = exports.CronyxArgumentError = exports.CronyxError = void 0;
/**
 * @public
 */
class CronyxError extends Error {
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
exports.CronyxError = CronyxError;
/**
 * @public
 */
class CronyxArgumentError extends CronyxError {
}
exports.CronyxArgumentError = CronyxArgumentError;
/**
 * @public
 */
class CronyxNotFoundError extends CronyxError {
}
exports.CronyxNotFoundError = CronyxNotFoundError;
//# sourceMappingURL=error.js.map