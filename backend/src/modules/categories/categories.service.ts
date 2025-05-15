import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { SupabaseService } from '../supabase/supabase.service';
  import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto';
  import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
  import { Tables } from '../../types/supabase';
  import { ApiResponse } from '../../types/response';
import { CustomRequest } from 'src/types/request.type';
  
  @Injectable()
  export class CategoryService {
    constructor(private readonly supabaseService: SupabaseService) {}
  
    /* ---------- CRUD on categories ---------- */
  
    async create(
      dto: CreateCategoryDto,
      req: CustomRequest,
    ): Promise<ApiResponse<Tables<'categories'>>> {
      const supabase = req["supabase"]
  
      const { data, error } = await supabase
        .from('categories')
        .insert({
          category_name: dto.category_name,
          description: dto.description,
          image_path:   dto.image_path,
        })
        .select('*')
        .maybeSingle();
      if (error?.code === '42501') {
        // permission error
        throw new BadRequestException(
          'You do not have permission to create a category',
        );
      }
      if (error?.code === '23514') {
        // check constraint violation
        throw new BadRequestException(
          'Category name must be at least 3 characters long',
        );
      }
      if (error?.code === '23505') {
        throw new BadRequestException(
          `Category "${dto.category_name}" already exists`,
        );
      }
      if (error) throw new BadRequestException(error.message);
      if (!data) throw new BadRequestException('Failed to create category');
  
      return { message: 'Category created', data };
    }
  
    async update(
      req: CustomRequest,
      category_id: string,
      dto: UpdateCategoryDto,
    ): Promise<ApiResponse<Tables<'categories'>>> {
      const supabase = req["supabase"]
  
      const { data, error } = await supabase
        .from('categories')
        .update({
          category_name: dto.category_name,
          description:   dto.description,
          image_path:    dto.image_path,
        })
        .eq('category_id', category_id)
        .select('*')
        .maybeSingle();
  
      if (error) throw new BadRequestException(error.message);
      if (!data) throw new NotFoundException('Category not found');
  
      return { message: 'Category updated', data };
    }
  
    async remove(req: CustomRequest, category_id: string): Promise<ApiResponse<null>> {
      const supabase = req["supabase"]
  
      const { error, count } = await supabase
        .from('categories')
        .delete({ count: 'exact' })
        .eq('category_id', category_id);
  
      // because of the FK `ON DELETE SET NULL` on items, no extra work needed
      if (error) throw new BadRequestException(error.message);
      if (!count) throw new NotFoundException('Category not found');
  
      return { message: 'Category deleted', data: null };
    }
  
    /* ---------- link / unlink items ---------- */
  
    async assignItemToCategory(
      req: CustomRequest,
      item_id: string,
      category_id: string,
    ): Promise<ApiResponse<Tables<'items'>>> {
      const supabase = req["supabase"]
  
      const { data, error } = await supabase
        .from('items')
        .update({ category_id })
        .eq('item_id', item_id)
        .select('*')
        .maybeSingle();
  
      if (error?.code === '23503') {
        // unknown category FK violation
        throw new BadRequestException('Category does not exist');
      }
      if (error) throw new BadRequestException(error.message);
      if (!data) throw new NotFoundException('Item not found');
  
      return { message: 'Item assigned to category', data };
    }
  
    async replaceCategoryWithUncategorized(
      req: CustomRequest,
      item_id: string,
    ): Promise<ApiResponse<Tables<'items'>>> {
      const supabase = req["supabase"]
      // Move to env later
      const uncategorized = "c5995b26-a630-46ca-84f0-aad9c02a3553";
  
      const { data, error } = await supabase
        .from('items')
        .update({ category_id: uncategorized })
        .eq('item_id', item_id)
        .select('*')
        .maybeSingle();
  
      if (error) throw new BadRequestException(error.message);
      if (!data) throw new NotFoundException('Item not found');
  
      return { message: `Category replaced with uncategorized for item ${item_id}`, data };
    }
  }