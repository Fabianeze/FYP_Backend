import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Driver } from "../../drivers/entities/driver.entity";
import { Trip } from "../../trips/entities/trip.entity";

@Entity("guests")
export class Guest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  guestId: string;

  @Column()
  name: string;

  @Column()
  email:string;

  @OneToMany(() => Trip, (trip) => trip.guest)
  trips: Trip[];

  @Column()
  password: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
