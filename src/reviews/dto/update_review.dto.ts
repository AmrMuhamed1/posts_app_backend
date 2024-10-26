import { IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class updateReviewDto{

    @IsNumber()
    @Max(5)
    @IsOptional()
    rating: number;


    @IsString()
    @IsOptional()
    comment: string;




}