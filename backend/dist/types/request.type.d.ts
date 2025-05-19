import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface CustomRequest extends Request {
    messsage: string;
    supabase: SupabaseClient;
    user: JwtPayload & {
        app_metadata?: {
            role: string;
        };
        [key: string]: unknown;
    };
}
