import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Put,
    Req,
  } from '@nestjs/common';
  import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto'; 
  import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
  import { CategoryService } from './categories.service';
import { CustomRequest } from 'src/types/request.type';
  
  @Controller('categories')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    /* ---------- CRUD ---------- */
  
    @Post()
    create(
      @Body() dto: CreateCategoryDto,
      @Req() req: CustomRequest,
    ) {
      return this.categoryService.create(dto,req);
    }
  
    @Put(':id')
    update(
      @Req() req: CustomRequest,
      @Param('id') id: string,
      @Body() dto: UpdateCategoryDto,
    ) {
      return this.categoryService.update(req,id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string,@Req() req: CustomRequest) {
      return this.categoryService.remove(req,id);
    }
  
    /* ---------- item helpers ---------- */
    // /categories/items/:itemId/:categoryId   (assign)
    @Post('/items/:itemId/:categoryId')
    assignItem(
      @Req() req: CustomRequest,
      @Param('itemId') itemId: string,
      @Param('categoryId') categoryId: string,
    ) {
      return this.categoryService.assignItemToCategory(req,itemId, categoryId);
    }
  
    // /categories/items/:itemId   (unlink)
    @Patch('/items/:itemId')
    removeItemCategory(
      @Param('itemId') itemId: string,
      @Req() req: CustomRequest) {
      return this.categoryService.replaceCategoryWithUncategorized(req,itemId);
    }
  }