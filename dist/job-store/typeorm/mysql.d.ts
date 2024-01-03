import type { AuroraMysqlConnectionOptions } from "typeorm/driver/aurora-mysql/AuroraMysqlConnectionOptions.js";
import type { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions.js";
import TypeormJobStore from "./index.js";
/**
 * @public
 */
export default class MysqlJobStore extends TypeormJobStore {
    protected uniqueConstraintErrorCode: string;
    static connect(options: MysqlConnectionOptions | AuroraMysqlConnectionOptions): Promise<TypeormJobStore>;
}
//# sourceMappingURL=mysql.d.ts.map