import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entites";
import { Repository } from "typeorm";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoriesDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async createCategories(categoryDto: createCategoryDto) {
    const category = this.repo.create(categoryDto);

    return this.repo.save(category);
  }

  async getAllCategories() {
    return this.repo.find();
  }


  async getOneCategory(id:number) {
    const category =  await this.repo.findOne({where:{id},relations:['products']});
    if(!category) throw new BadRequestException('category not found');
    return category;
  }


  async updateCategories(id:number,body:UpdateCategoriesDto) {
    const category =  await this.repo.findOne({where:{id}});
    if(!category) throw new BadRequestException('category not found');
    category.name = body.name ?? category.name;
    return this.repo.save(category);
    
  }

  async deleteCategories(id:number) {
    const category =  await this.repo.findOne({where:{id},relations:['products']});
    return this.repo.remove(category);
    
  }
}
