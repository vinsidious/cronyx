import type { AuroraPostgresConnectionOptions } from "typeorm/driver/aurora-postgres/AuroraPostgresConnectionOptions.js";
import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import TypeormJobStore from "./index.js";
/**
 * @public
 */
export default class PostgresJobStore extends TypeormJobStore {
    protected uniqueConstraintErrorCode: string;
    static connect(options: PostgresConnectionOptions | AuroraPostgresConnectionOptions): Promise<TypeormJobStore>;
}
//# sourceMappingURL=postgres.d.ts.map