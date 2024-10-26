import { Exclude } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { Current_date } from "src/utils/current_time";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany
} from "typeorm";

export enum userType {
  ADMIN = "admin",
  NORMAL_USER = "normal"
}

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userName: string;
  @Column({ type: "varchar", length: "250", unique: true })
  email: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ type: "enum", enum: userType, default: userType.NORMAL_USER })
  userType: userType;
  @Column({ default: false })
  isAccountVerified: boolean;

  @OneToMany(() => Product, (prod) => prod.user)
  product: Product[];

  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  @CreateDateColumn({ type: "timestamp", default: () => Current_date })
  createdAt: Date;
  @CreateDateColumn({
    type: "timestamp",
    default: () => Current_date,
    onUpdate: Current_date
  })
  updatedAt: Date;

  @Column({ nullable: true, type: "json" })
  profileImage: {
    publicId?: string;
    url?: string;
  };
}
