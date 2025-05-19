import { SupabaseService } from '../supabase/supabase.service';
import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
import { Tables } from '../../types/supabase';
import { ApiResponse } from '../../types/response';
import { CustomRequest } from 'src/types/request.type';
export declare class CategoryService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(dto: CreateCategoryDto, req: CustomRequest): Promise<ApiResponse<Tables<'categories'>>>;
    update(req: CustomRequest, category_id: string, dto: UpdateCategoryDto): Promise<ApiResponse<Tables<'categories'>>>;
    remove(req: CustomRequest, category_id: string): Promise<ApiResponse<null>>;
    assignItemToCategory(req: CustomRequest, item_id: string, category_id: string): Promise<ApiResponse<Tables<'items'>>>;
    replaceCategoryWithUncategorized(req: CustomRequest, item_id: string): Promise<ApiResponse<Tables<'items'>>>;
}
