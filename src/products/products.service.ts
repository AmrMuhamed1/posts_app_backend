import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { createNewProductDto } from "./dtos/create-product.dtos";
import { updateProductDto } from "./dtos/update-product.dtos";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/users/user.service";
import { CategoriesService } from "src/categories/categories.service";

/* eslint-disable @typescript-eslint/no-unused-vars */

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    private userService: UserService,
    private categoriesService: CategoriesService
  ) {}
  /**
   * create new product
   */
  async createNewProduct(dto: createNewProductDto, userId: string) {
    const { categoryId } = dto;
    const product = this.repo.create(dto);

    const user = await this.userService.getProfile(userId);

    const category = await this.categoriesService.getOneCategory(categoryId);

    product.user = user;
    product.category = category;

    return this.repo.save(product);
  }

  /**
   * create all product
   */
  getAllProducts() {
    return this.repo.find({ relations: ["user", "category"] });
  }
  /**
   * create one product
   */
  async getOneProduct(id: number) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ["user", "review", "category"]
    });
    if (!product) throw new NotFoundException();
    return product;
  }
  /**
   * update  product
   */
  async updateProduct(
    id: number,
    updateProductDto: updateProductDto,
    userId: number
  ) {
    const product = await this.getOneProduct(id);
    if (product.user?.id !== userId) {
      throw new ForbiddenException("you not allowed to do this operation");
    }

    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;

    return this.repo.save(product);
  }

  /**
   * delete product
   */
  async deleteProduct(id: number, userId: number) {
    const product = await this.getOneProduct(id);
    if (product.user?.id !== userId) {
      throw new ForbiddenException("you not allowed to do this operation");
    }
    await this.repo.remove(product);
    return {
      message: "product deleted successfully"
    };
  }
}
