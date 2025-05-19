import { SupabaseService } from '../supabase/supabase.service';
import { Tables } from 'src/types/supabase';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';
export declare class ItemService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    addItem(req: CustomRequest, item: Partial<Tables<'items'>>): Promise<ApiResponse<Tables<'items'>>>;
    updateItem(req: CustomRequest, itemId: string, item: Partial<Tables<'items'>>): Promise<ApiResponse<Tables<'items'>>>;
    deleteItem(req: CustomRequest, itemId: string): Promise<ApiResponse<Tables<'items'>>>;
}
