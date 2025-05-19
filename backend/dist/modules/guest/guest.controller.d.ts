import { GuestService } from './guest.service';
export declare class GuestController {
    private readonly guestService;
    constructor(guestService: GuestService);
    getAllCategories(): Promise<{
        message: string;
        data: {
            category_id: any;
            category_name: any;
            image_path: any;
        }[];
    }>;
    getFilteredItems(categories: string): Promise<{
        message: string;
        data: any[];
    }>;
    getItemsAdmin(): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
        item_id: string;
        item_name: string;
        location: string;
        quantity: number;
        visible: boolean;
    }[]>>;
    getItemById(id: string): Promise<import("../../types/response").ApiResponse<{
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
    getItems(): Promise<import("../../types/response").ApiResponse<{
        category_id: string;
        created_at: string | null;
        description: string | null;
        image_path: string[] | null;
        item_id: string;
        item_name: string;
        location: string;
        quantity: number;
        visible: boolean;
    }[]>>;
}
