import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UserService } from "src/users/user.service";
import { ProductService } from "src/products/products.service";
import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import { updateReviewDto } from "./dto/update_review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private repo: Repository<Review>,
    private userService: UserService,
    private productService: ProductService
  ) {}

  async createReview(
    createReview: CreateReviewDto,
    userId: string,
    productId: number
  ) {
    const review = this.repo.create(createReview);
    const user = await this.userService.getProfile(userId);
    if (!user) throw new BadRequestException();

    review.user = user;

    const product = await this.productService.getOneProduct(productId);

    if (!product) throw new BadRequestException();
    review.product = product;

    return this.repo.save(review);
  }

  async getOneReview(id: number) {
    const review = this.repo.findOne({
      where: { id },
      relations: ["product", "user"]
    });

    if (!review) throw new BadRequestException();

    return review;
  }

  async updateReview(
    id: number,
    userId: number,
    updateReviewDto: updateReviewDto
  ) {
    let review = await this.getOneReview(id);

    if (userId !== review.user.id) throw new ForbiddenException("not allowed");

    review.comment = updateReviewDto.comment ?? review.comment;
    review.rating = updateReviewDto.rating ?? review.rating;

    return this.repo.save(review);
  }

  async deleteReview(id: number, userId: number) {
    let review = await this.getOneReview(id);
    console.log(review.product.user.id);
    if (userId !== review.user.id) throw new ForbiddenException("not allowed");

    return this.repo.remove(review);
  }
}
