import { IsNumber, IsString } from "class-validator";
import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import { Current_date } from "src/utils/current_time";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn,ManyToOne, Column} from "typeorm";


@Entity({name:'reviews'})
export class Review {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  rating: number;

  @Column()
  comment: string;
  

  @CreateDateColumn({ type: "timestamp", default: () => Current_date })
  createdAt: Date;
  @CreateDateColumn({type: "timestamp",default: () => Current_date, onUpdate: Current_date})
  updatedAt: Date;

  @ManyToOne(()=>Product,(product)=>product.review)
  product:Product

  @ManyToOne(()=>User,(user)=>user.review)
  user:User;

}
