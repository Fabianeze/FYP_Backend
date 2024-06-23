import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Trip } from "./entities/trip.entity";
const repo = dataSource.getRepository(Trip);

export class TripService extends BaseRepository<Trip> {
  constructor() {
    super(repo);
  }
}
