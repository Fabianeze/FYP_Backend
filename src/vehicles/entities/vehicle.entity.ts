import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Driver } from "../../drivers/entities/driver.entity";
import { Maintenance } from "../../maintenances/entities/maintenance.entity";
import { Trip } from "../../trips/entities/trip.entity";

@Entity("vehicles")
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  plateNo: string;

  @Column()
  color: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  status: string;

  @Column()
  image: string;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenances: Maintenance[];
  
  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];

  @OneToOne(() => Driver, (driver) => driver.vehicle, { nullable: true })
  driver: Driver | null;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;
}
