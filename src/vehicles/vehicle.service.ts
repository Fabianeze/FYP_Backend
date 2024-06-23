import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Vehicle } from "./entities/vehicle.entity";
const repo = dataSource.getRepository(Vehicle);

export class VehicleService extends BaseRepository<Vehicle> {
  constructor() {
    super(repo);
  }
}
