import { SupabaseService } from '../supabase/supabase.service';
import { CustomRequest } from 'src/types/request.type';
import { CreateTagDto } from './dto/create-tag.dto';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(req: CustomRequest, dto: CreateTagDto): Promise<ApiResponse<Tables<'tags'>>>;
    update(req: CustomRequest, tag_id: string, dto: UpdateTagDto): Promise<ApiResponse<Tables<'tags'>>>;
    remove(req: CustomRequest, tag_id: string): Promise<ApiResponse<[]>>;
    addTagToItem(req: CustomRequest, item_id: string, tag_id: string): Promise<ApiResponse<Tables<'item_tags'>>>;
    removeTagFromItem(req: CustomRequest, item_id: string, tag_id: string): Promise<ApiResponse<[]>>;
}
