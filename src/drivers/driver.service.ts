import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Driver } from "./entities/driver.entity";
const repo = dataSource.getRepository(Driver);

export class DriverService extends BaseRepository<Driver> {
  constructor() {
    super(repo);
  }
}
