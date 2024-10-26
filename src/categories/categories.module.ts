import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entites';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports:[TypeOrmModule.forFeature([Category]),UserModule],
  exports:[CategoriesService]
})
export class CategoriesModule {}
