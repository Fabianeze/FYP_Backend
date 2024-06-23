import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";
import { BaseInterface } from "./base.interface.repository";
import { sortOrder } from "../enums";
import {
  IMetaProps,
  IOptions,
  IPaginateMeta,
  IPaginateResult,
} from "../interfaces/pagination-interface";
import { error } from "console";
import HttpError from "../Error";
interface hasId {
  id: string;
}
export class BaseRepository<T extends Record<string, any>>
  implements BaseInterface<T>
{
  entity: Repository<T>;
  protected constructor(repository: Repository<T>) {
    this.entity = repository;
  }

  private getMeta({ data, total, limit, page }: IMetaProps) {
    const meta: IPaginateMeta = {
      totalItems: total,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      count: data.length,
    };
    return meta;
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const dataa = this.entity.create(data);
    return this.entity.save(dataa);
  }

  public async findAllWithPagination(
    conditions: FindManyOptions<T> | FindOptionsWhere<T>,
    options: IOptions,
    sortOrder: sortOrder,
    sortBy?: keyof T
  ): Promise<IPaginateResult<T>> {
    if (sortBy) {
      const order: FindOptionsOrder<T> = {
        [sortBy]: sortOrder,
      } as FindOptionsOrder<T>;

      conditions = { ...conditions, order };
    }

    const { limit, page } = options;

    const query = { ...conditions, take: limit, skip: (page - 1) * limit };
    const [data, total] = await this.entity.findAndCount(query);
    const meta = this.getMeta({ data, total, limit, page });
    return { data, meta };
  }

  async findOne(conditions: FindOneOptions<T>): Promise<T | null> {
    const record = await this.entity.findOne(conditions);
    if (!record) {
      return null;
    }
    return record;
  }

  public async findAll(conditions: FindOneOptions<T>): Promise<T[]> {
    const records = await this.entity.find(conditions);
    return records;
  }

  async deleteOne(
    conditions: FindOptionsWhere<T>
  ): Promise<{ message: "Deleted Successfully" }> {
    const record = await this.entity.delete(conditions);
    return { message: "Deleted Successfully" };
  }

  public async saveMany(
    entites: T[]
  ): Promise<{ message: "Saved sucessfully" }> {
    entites.forEach((element) => {
      this.entity.save(element);
    });

    return { message: "Saved sucessfully" };
  }

  async update(id: FindOneOptions<T>, data: DeepPartial<T>): Promise<T> {
    // Find the entity to update
    const entityToUpdate = await this.entity.findOne(id);
    console.log(entityToUpdate)
    // Throw error if entity does not exist
    if (!entityToUpdate) {
      throw new Error(`${this.entity || "Record"} does not exist`);
    }

    // Log the data being updated
    console.log("Updating entity with:", { id, ...entityToUpdate, ...data });

    try {
      // Update the entity with new data and save to database
      const updatedEntity = await this.entity.save({
        ...entityToUpdate,
        ...data,
      });

      // Log the updated entity for verification
      console.log("Entity updated:", updatedEntity);

      return updatedEntity; // Return the updated entity
    } catch (error) {
      console.error("Error updating entity:", error);
      throw error; // Propagate the error for handling upstream
    }
  }

  async updateWhere(
    condition: FindOptionsWhere<T> | FindOneOptions<T>,
    data: DeepPartial<T>
  ): Promise<T> {
    const exists = await this.entity.findOne(condition);
    if (!exists) throw new Error(`${this.entity || "Record"} Does Not Exist`);
    return await this.entity.save({ ...exists, ...data });
  }
}
