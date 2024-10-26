import { IsEmail, IsNotEmpty, IsString, isString } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
