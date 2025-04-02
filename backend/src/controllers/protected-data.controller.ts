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
      // ingore type issues


      console.log(`[${new Date().toISOString()}] Protected endpoint called by user: ${user.id} (${user.email})`);
      
      // Fetch data from the protected_data table using the service method
      // disable type errors for next line
      if (!user.id) {
        throw new Error('User ID is missing');
      }
      const data = await this.supabaseService.getProtectedData(user.id);
      console.log(`[${new Date().toISOString()}] Data retrieved for user ${user.id}: ${data.length} records`);
      
      // Log the actual data if needed (be careful with sensitive information)
      if (data.length > 0) {
        console.log(`[${new Date().toISOString()}] Sample data:`, JSON.stringify(data[0]));
      }

      return {
        status: 'success',
        data,
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
