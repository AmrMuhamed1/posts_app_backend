import { IsString, IsNumber, IsNotEmpty, Min, Max } from "class-validator";

export class createNewProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: "price must be more than 0" })
  @Max(10000000, { message: "price must be less than 10000000" })
  price: number;

  @IsNumber()
  categoryId:number

  
}
