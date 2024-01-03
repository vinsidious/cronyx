import { DataSource } from "typeorm";
import { CronyxArgumentError } from "../../error.js";
import { TypeormJobLockEntity } from "../../job-lock/typeorm.js";
import TypeormJobStore from "./index.js";
/**
 * @public
 */
export default class PostgresJobStore extends TypeormJobStore {
    constructor() {
        super(...arguments);
        this.uniqueConstraintErrorCode = "23505";
    }
    static async connect(options) {
        if (options.entities)
            throw new CronyxArgumentError("Option entities should not be passed");
        const dataSource = new DataSource({ ...options, entities: [TypeormJobLockEntity], synchronize: true });
        await dataSource.initialize();
        return new PostgresJobStore(dataSource);
    }
}
//# sourceMappingURL=postgres.js.map