import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("managers")
export class Manager {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  managerId: string;

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

  @Column()
  profilePhoto: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
