import { ItemService } from './items.service';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    addItem(req: CustomRequest, item: Tables<'items'>): Promise<import("../../types/response").ApiResponse<{
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
    updateItem(req: CustomRequest, id: string, item: Partial<Tables<'items'>>): Promise<import("../../types/response").ApiResponse<{
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
    deleteItem(req: CustomRequest, id: string): Promise<import("../../types/response").ApiResponse<{
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
