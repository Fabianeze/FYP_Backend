import { dataSource } from "../../db/datasource";
import { BaseRepository } from "../common/base/base.abstract.repository";
import { Guest } from "./entities/guest.entity";
const repo = dataSource.getRepository(Guest);

export class GuestService extends BaseRepository<Guest> {
  constructor() {
    super(repo);
  }
}
