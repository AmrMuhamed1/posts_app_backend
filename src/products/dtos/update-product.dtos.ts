import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional
} from "class-validator";

export class updateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: "price must be more than 0" })
  @Max(11, { message: "price must be less than 10" })
  @IsOptional()
  price?: number;
}
