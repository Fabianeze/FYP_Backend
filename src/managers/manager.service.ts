import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Manager } from "./entities/manager.entity";
const repo = dataSource.getRepository(Manager);

export class ManagerService extends BaseRepository<Manager> {
  constructor() {
    super(repo);
  }
}
