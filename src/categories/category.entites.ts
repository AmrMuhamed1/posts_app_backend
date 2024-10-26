import { Product } from "src/products/product.entity";
import { Current_date } from "src/utils/current_time";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string

    @CreateDateColumn({type:'timestamp' , default: ()=>Current_date})
    createdAt: Date;
    @CreateDateColumn({type:'timestamp' , default: ()=>Current_date,onUpdate:Current_date})
    updatedAt: Date;
  

    @OneToMany(()=>Product,(product)=>product.category)
    products:Product[]

}