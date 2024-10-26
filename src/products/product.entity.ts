import { Category } from "src/categories/category.entites";
import { Review } from "src/reviews/review.entity";
import { User } from "src/users/user.entity";
import { Current_date } from "src/utils/current_time";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
  @Column()
  title: string;
  @Column()
  price: number;

  @CreateDateColumn({ type: "timestamp", default: () => Current_date })
  createdAt: Date;
  @CreateDateColumn({
    type: "timestamp",
    default: () => Current_date,
    onUpdate: Current_date
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  review: Review[];

  @ManyToOne(() => User, (user) => user.product)
  user: User;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true, type: "json" })
  productImage: [
    {
      url?: string;
      publicId?: string;
    }
  ];
}
