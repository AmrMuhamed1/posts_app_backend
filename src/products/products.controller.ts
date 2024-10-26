/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Req,
  ClassSerializerInterceptor,
  Query
} from "@nestjs/common";
import { createNewProductDto } from "./dtos/create-product.dtos";
import { updateProductDto } from "./dtos/update-product.dtos";
import { ProductService } from "./products.service";
import { Request } from "express";
import { AuthGuard } from "src/users/gaurds/user-auth.gurad";
import { UserIdInterceptor } from "src/users/interceptors/user-id.interceptor";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // Adjust based on your actual user object structure
        // Add other properties if needed
      };
    }
  }
}
@Controller("api/products")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private productService: ProductService) {
  }

  @Post()
  @UseInterceptors(UserIdInterceptor)
  public createNewProduct(
    @Body() body: createNewProductDto,
    @Req() request: Request
  ) {
    const userId = request.user?.id;
    return this.productService.createNewProduct(body, userId.toString());
  }

  @Get()
  public getAllProducts(@Query("search") search: string) {
    return this.productService.getAllProducts();
  }

  @Get("/:id")
  public getSingleProductById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.getOneProduct(id);
  }

  @Put("/:id")
  @UseInterceptors(UserIdInterceptor)
  public updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: updateProductDto,
    @Req() request: Request
  ) {
    const userId = request.user?.id;
    return this.productService.updateProduct(id, body, userId);
  }

  @Delete("/:id")
  @UseInterceptors(UserIdInterceptor)
  public deleteProduct(
    @Param("id", ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    const userId = request.user.id;
    return this.productService.deleteProduct(id, userId);
  }
}
