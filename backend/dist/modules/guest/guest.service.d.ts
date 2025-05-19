import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';
import { ConfigService } from '@nestjs/config';
export declare class GuestService {
    private configService;
    private readonly _supabase;
    constructor(configService: ConfigService);
    getPublicItems(): Promise<ApiResponse<Tables<'items'>[]>>;
    getItemById(itemId: string): Promise<ApiResponse<Tables<'items'>>>;
    getCategories(): Promise<{
        message: string;
        data: {
            category_id: any;
            category_name: any;
            image_path: any;
        }[];
    }>;
    getItemsByCategories(categories: string[]): Promise<{
        message: string;
        data: any[];
    }>;
    getItemsAdmin(): Promise<ApiResponse<Tables<'items'>[]>>;
}
