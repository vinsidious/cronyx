import { DataSource } from "typeorm";
import type { AuroraPostgresConnectionOptions } from "typeorm/driver/aurora-postgres/AuroraPostgresConnectionOptions.js";
import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import { CronyxArgumentError } from "../../error.js";
import { TypeormJobLockEntity } from "../../job-lock/typeorm.js";
import TypeormJobStore from "./index.js";

/**
 * @public
 */
export default class PostgresJobStore extends TypeormJobStore {
  protected uniqueConstraintErrorCode: string = "23505";

  static async connect(options: PostgresConnectionOptions | AuroraPostgresConnectionOptions): Promise<TypeormJobStore> {
    if (options.entities) throw new CronyxArgumentError("Option entities should not be passed");

    const dataSource = new DataSource({ ...options, entities: [TypeormJobLockEntity], synchronize: true });
    await dataSource.initialize();
    return new PostgresJobStore(dataSource);
  }
}
