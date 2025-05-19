import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    supabase: SupabaseClient;
    user: User;
}
export declare class AuthMiddleware implements NestMiddleware {
    private configService;
    constructor(configService: ConfigService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export {};
