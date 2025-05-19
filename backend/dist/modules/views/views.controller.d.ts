import { CustomRequest } from '../../types/request.type';
import { ViewsService } from './view.service';
export declare class ViewsController {
    private readonly viewsService;
    constructor(viewsService: ViewsService);
    getFrontendItems(req: CustomRequest): Promise<import("../../types/response").ApiResponse<{
        category_name: string | null;
        description: string | null;
        image_path: string[] | null;
        item_id: string | null;
        item_name: string | null;
        quantity: number | null;
        tags: string[] | null;
    }[]>>;
}
