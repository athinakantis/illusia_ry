import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../services/supabase.service';
import { User } from '@supabase/supabase-js';
 
@Controller('protected-data')
export class ProtectedDataController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async getProtectedData(@Req() req: Request) {
    try {
      if (!req['user']) {
        return {
          status: 'error',
          message: 'Unauthorized access',
        };
      }
      // Use the user from the request (added by AuthMiddleware)
      const user:Partial<User> = req['user'];
  
      if (!user.id) {
        throw new Error('User ID is missing');
      }
      // const data = await this.supabaseService.getProtectedData(user.id);
  
     
      return {
        status: 'success',
        // data,
        user: {
              id: user.id,
              email: user.email,
        },
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in protected endpoint:`, error.message);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

}
