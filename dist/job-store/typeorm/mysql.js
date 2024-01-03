import { DataSource } from "typeorm";
import { CronyxArgumentError } from "../../error.js";
import { TypeormJobLockEntity } from "../../job-lock/typeorm.js";
import TypeormJobStore from "./index.js";
/**
 * @public
 */
export default class MysqlJobStore extends TypeormJobStore {
    constructor() {
        super(...arguments);
        this.uniqueConstraintErrorCode = "ER_DUP_ENTRY";
    }
    static async connect(options) {
        if (options.entities)
            throw new CronyxArgumentError("Option entities should not be passed");
        const dataSource = new DataSource({ ...options, entities: [TypeormJobLockEntity], synchronize: true });
        await dataSource.initialize();
        return new MysqlJobStore(dataSource);
    }
}
//# sourceMappingURL=mysql.js.map