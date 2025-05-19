import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';
export declare class ViewsService {
    getFrontendItemView(req: CustomRequest): Promise<ApiResponse<Tables<'frontend_item_view'>[]>>;
}
