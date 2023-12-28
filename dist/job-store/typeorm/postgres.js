"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const error_1 = require("../../error");
const typeorm_2 = require("../../job-lock/typeorm");
const _1 = require("./");
/**
 * @public
 */
class PostgresJobStore extends _1.default {
    constructor() {
        super(...arguments);
        this.uniqueConstraintErrorCode = "23505";
    }
    static async connect(options) {
        if (options.entities)
            throw new error_1.CronyxArgumentError("Option entities should not be passed");
        const dataSource = new typeorm_1.DataSource({ ...options, entities: [typeorm_2.TypeormJobLockEntity], synchronize: true });
        await dataSource.initialize();
        return new PostgresJobStore(dataSource);
    }
}
exports.default = PostgresJobStore;
//# sourceMappingURL=postgres.js.map