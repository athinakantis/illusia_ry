import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
import { CategoryService } from './categories.service';
import { CustomRequest } from 'src/types/request.type';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto, req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        category_name: string | null;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
    }>>;
    update(req: CustomRequest, id: string, dto: UpdateCategoryDto): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        category_name: string | null;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
    }>>;
    remove(id: string, req: CustomRequest): Promise<import("../../types/response").ApiResponse<null>>;
    assignItem(req: CustomRequest, itemId: string, categoryId: string): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
        item_id: string;
        item_name: string;
        location: string;
        quantity: number;
        visible: boolean;
    }>>;
    removeItemCategory(itemId: string, req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
        item_id: string;
        item_name: string;
        location: string;
        quantity: number;
        visible: boolean;
    }>>;
}
