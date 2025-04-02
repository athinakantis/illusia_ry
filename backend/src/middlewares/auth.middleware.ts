import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `[${new Date().toISOString()}] Authenticating request to: ${req.method} ${req.path}`,
    );

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(
          `[${new Date().toISOString()}] Authentication failed: Missing or invalid token`,
        );
        throw new UnauthorizedException(
          'Missing or invalid authorization token',
        );
      }

      const token = authHeader.split(' ')[1];

      // Initialize Supabase client with service role key for server-side operations
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
     
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL or Anon key not found in environment variables');
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Verify the user's JWT token
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        console.log(
          `[${new Date().toISOString()}] Authentication failed: Invalid or expired token`,
        );
        throw new UnauthorizedException('Invalid or expired token');
      }

      console.log(
        `[${new Date().toISOString()}] Authentication successful for user: ${user.id}`,
      );

      // Attach the user to the request
      req['user'] = user;

      next();
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Authentication error:`,
        error.message,
      );
      throw new UnauthorizedException('Unauthorized: ' + error.message);
    }
  }
}
