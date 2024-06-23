import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from "typeorm";
import { IOptions, IPaginateResult } from "../interfaces/pagination-interface";
import { sortOrder } from "../enums";
export interface BaseInterface<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findOne(conditions: FindManyOptions<T>): Promise<T | null>;
  // findOneById(id: string): Promise<T>;
  findAllWithPagination(
    conditions: FindManyOptions<T> | FindOptionsWhere<T>,
    options: IOptions,
    sortOrder: sortOrder.ASC | sortOrder.DESC,
    sortBy?: keyof T
  ): Promise<IPaginateResult<T>>;
  findAll(conditions: FindManyOptions<T>): Promise<T[]>;
  deleteOne(
    conditions: FindOptionsWhere<T>
  ): Promise<{ message: "Deleted Successfully" }>;
  saveMany(entites: T[]): Promise<{ message: "Saved sucessfully" }>;
  update(id: FindOneOptions<T>, data: DeepPartial<T>): Promise<T>;
  updateWhere(
    condition: FindOptionsWhere<T> | FindOneOptions<T>,
    data: DeepPartial<T>
  ): Promise<T>;
}
