import { Module } from "@nestjs/common";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { AuthGuard } from "src/users/gaurds/user-auth.gurad";
import { UserModule } from "src/users/user.module";
import { CategoriesModule } from "src/categories/categories.module";
import { CloudinaryProvider } from "src/utils/cloudinary.config";
@Module({
  controllers: [ProductController],
  providers: [ProductService, CloudinaryProvider],
  imports: [TypeOrmModule.forFeature([Product]), UserModule, CategoriesModule],
  exports: [ProductService]
})
export class ProductModule {}
