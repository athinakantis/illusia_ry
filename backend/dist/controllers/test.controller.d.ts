import { SupabaseService } from '../services/supabase.service';
export declare class TestController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    testConnection(): Promise<{
        status: string;
        data: any[];
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
        data?: undefined;
    }>;
}
