import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { createCategoryDto } from "./dto/create-category.dto";
import { AuthGuard } from "src/users/gaurds/user-auth.gurad";
import { AdminInterceptor } from "src/users/interceptors/admin.interceptor";
import { UpdateCategoriesDto } from "./dto/update-category.dto";

@Controller("api/categories")
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  @UseInterceptors(AdminInterceptor)
  createCategoryDto(@Body() body: createCategoryDto) {
    return this.categoryService.createCategories(body);
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get("/:id")
  getOneCategory(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @Put("/:id")
  @UseInterceptors(AdminInterceptor)
  updateCategory(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCategoriesDto
  ) {
    return this.categoryService.updateCategories(id, body);
  }

  @Delete("/:id")
  @UseInterceptors(AdminInterceptor)
  deleteCategory(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.deleteCategories(id);
  }
}
