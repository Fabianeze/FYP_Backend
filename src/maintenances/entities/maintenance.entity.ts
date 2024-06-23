import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "../../vehicles/entities/vehicle.entity";
import { Driver } from "../../drivers/entities/driver.entity";

@Entity("maintenances")
export class Maintenance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  maintenanceId: string;
  
  @Column()
  description: string;

  @Column()
  driverId: string;

  @Column()
  vehicleId: string;

  @Column()
  comment: string;

  @ManyToOne(() => Driver, (driver) => driver.maintenances, { nullable: true })
  @JoinColumn({ name: "driverId", referencedColumnName: "id" })
  driver: Driver | null;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenances, {
    nullable: true,
  })
  @JoinColumn({ name: "vehicleId", referencedColumnName: "id" })
  vehicle: Vehicle | null;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  status: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
