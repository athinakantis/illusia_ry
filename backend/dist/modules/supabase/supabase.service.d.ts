import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private readonly configService;
    private readonly _supabase;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    logAction<T>(log: {
        user_id: string;
        action_type: string;
        target_id?: string;
        metadata?: Record<string, T>;
    }): Promise<void>;
}
