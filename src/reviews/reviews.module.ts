import { Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { UserService } from 'src/users/user.service';
import { UserModule } from 'src/users/user.module';
import { ReviewsService } from './review.service';
import { ProductModule } from 'src/products/products.module';

@Module({
  controllers: [ReviewController],
  imports:[TypeOrmModule.forFeature([Review]),UserModule,ProductModule],
  providers:[ReviewsService]
})
export class ReviewsModule {}
