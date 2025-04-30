import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Put,
  } from '@nestjs/common';
  import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto'; 
  import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
  import { CategoryService } from './categories.service';
  
  @Controller('categories')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    /* ---------- CRUD ---------- */
  
    @Post()
    create(@Body() dto: CreateCategoryDto) {
      return this.categoryService.create(dto);
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateCategoryDto,
    ) {
      return this.categoryService.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.categoryService.remove(id);
    }
  
    /* ---------- item helpers ---------- */
    // /categories/items/:itemId/:categoryId   (assign)
    @Post('/items/:itemId/:categoryId')
    assignItem(
      @Param('itemId') itemId: string,
      @Param('categoryId') categoryId: string,
    ) {
      return this.categoryService.assignItemToCategory(itemId, categoryId);
    }
  
    // /categories/items/:itemId   (unlink)
    @Patch('/items/:itemId')
    removeItemCategory(@Param('itemId') itemId: string) {
      return this.categoryService.replaceCategoryWithUncategorized(itemId);
    }
  }