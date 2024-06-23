import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "../../vehicles/entities/vehicle.entity";
import { Trip } from "../../trips/entities/trip.entity";
import { Maintenance } from "../../maintenances/entities/maintenance.entity";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  driverId: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  phoneNo: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  vehicleId: string | null;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.driver, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "vehicleId", referencedColumnName: "id" })
  vehicle: Vehicle | null;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: Trip[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.driver)
  maintenances: Maintenance[];

  @Column()
  profilePhoto: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
