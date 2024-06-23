import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Maintenance } from "./entities/maintenance.entity";
const repo = dataSource.getRepository(Maintenance);

export class MaintenanceService extends BaseRepository<Maintenance> {
  constructor() {
    super(repo);
  }
}
