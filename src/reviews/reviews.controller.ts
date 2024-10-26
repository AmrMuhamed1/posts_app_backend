import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ReviewsService } from "./review.service";
import { AuthGuard } from "src/users/gaurds/user-auth.gurad";
import { UserIdInterceptor } from "src/users/interceptors/user-id.interceptor";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Request } from "express";
import { updateReviewDto } from "./dto/update_review.dto";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // or whatever type you use for user ID
      };
    }
  }
}

@Controller("api/review")
export class ReviewController {
  constructor(readonly reviewService: ReviewsService) {}

  @Post("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  createReview(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: CreateReviewDto,
    @Req() request: Request
  ) {
    const userId = request.user.id;

    return this.reviewService.createReview(body, userId.toString(), id);
  }

  @Get("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getOneReview(@Param("id", ParseIntPipe) id: number) {
    return this.reviewService.getOneReview(id);
  }

  @Put("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(UserIdInterceptor)
  updateReview(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: updateReviewDto
  ) {
    const userId = req.user?.id;
    return this.reviewService.updateReview(id, userId, body);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(UserIdInterceptor)
  deleteReview(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user?.id;
    return this.reviewService.deleteReview(id, userId);
  }
}
