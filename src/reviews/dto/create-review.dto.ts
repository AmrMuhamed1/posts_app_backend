import { IsNumber, IsString, Length, Max, Min } from "class-validator";

export class CreateReviewDto{

    @IsNumber()
    @Max(5)
    rating: number;


    @IsString()
    comment: string;




}