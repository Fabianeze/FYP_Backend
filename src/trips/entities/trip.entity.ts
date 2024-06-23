import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Driver } from "../../drivers/entities/driver.entity";
import { Guest } from "../../guests/entities/guest.entity";
import { Vehicle } from "../../vehicles/entities/vehicle.entity";

@Entity("trips")
export class Trip {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tripId: string;

  @Column()
  type: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  driverId: string | null;

  @ManyToOne(() => Driver, (driver) => driver.trips, { nullable: true })
  @JoinColumn({ name: "driverId", referencedColumnName: "id" })
  driver: Driver | null;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips, { nullable: true })
  @JoinColumn({ name: "vehicleId", referencedColumnName: "id" })
  vehicle: Vehicle | null;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Guest, (guest) => guest.trips, { nullable: true })
  @JoinColumn({ name: "guestId", referencedColumnName: "id" })
  guest: Guest | null;

  @Column()
  guestId: string;
  @Column()
  status: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
