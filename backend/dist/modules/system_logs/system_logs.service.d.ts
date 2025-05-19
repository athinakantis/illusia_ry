import { SupabaseService } from '../supabase/supabase.service';
export interface LogQueryOptions {
    limit?: number;
    page?: number;
    actionType?: string;
    tableName?: string;
    userId?: string;
    from?: string;
    to?: string;
    search?: string;
}
export declare class SystemLogsService {
    private readonly supabase;
    private readonly DEFAULT_LIMIT;
    private readonly MAX_LIMIT;
    constructor(supabase: SupabaseService);
    findAll(opts?: LogQueryOptions): Promise<{
        data: any[] | null;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
