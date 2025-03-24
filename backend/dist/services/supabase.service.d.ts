import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private readonly _supabase;
    constructor(configService: ConfigService);
    get supabase(): SupabaseClient<any, "public", any>;
    getUsers(): Promise<any[]>;
    addUser(user: {
        name: string;
        email: string;
    }): Promise<null>;
}
