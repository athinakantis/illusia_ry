import { TagService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { CustomRequest } from 'src/types/request.type';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    create(req: CustomRequest, dto: CreateTagDto): Promise<import("../../types/response").ApiResponse<{
        created_at: string | null;
        description: string | null;
        tag_id: string;
        tag_name: string | null;
    }>>;
    update(req: CustomRequest, id: string, dto: UpdateTagDto): Promise<import("../../types/response").ApiResponse<{
        created_at: string | null;
        description: string | null;
        tag_id: string;
        tag_name: string | null;
    }>>;
    remove(req: CustomRequest, id: string): Promise<import("../../types/response").ApiResponse<[]>>;
    addTagToItem(req: CustomRequest, itemId: string, tagId: string): Promise<import("../../types/response").ApiResponse<{
        created_at: string;
        item_id: string;
        tag_id: string;
    }>>;
    removeTagFromItem(req: CustomRequest, itemId: string, tagId: string): Promise<import("../../types/response").ApiResponse<[]>>;
}
