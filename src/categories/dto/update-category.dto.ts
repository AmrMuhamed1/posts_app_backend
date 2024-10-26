import { IsString } from "class-validator";


export class UpdateCategoriesDto{

    @IsString()
    name:string
}