import { Module } from "@nestjs/common";
import { ReviewsModule } from "./reviews/reviews.module";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Review } from "./reviews/review.entity";
import { User } from "./users/user.entity";
import { CategoriesModule } from './categories/categories.module';
import { Category } from "./categories/category.entites";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          username: config.get<string>("DB_USERNAME"),
          database: config.get<string>("DB_DATABASE"),
          password: config.get<string>("DB_PASSWORD"),
          port: config.get<number>("DB_PORT"),
          host: "localhost",
          synchronize: process.env.NODE_ENV !== "production",
          entities: [Product, Review, User,Category]
        };
      }
    }),
    ReviewsModule,
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development"
    }),
    CategoriesModule,
  ]
})
export class AppModule {}
