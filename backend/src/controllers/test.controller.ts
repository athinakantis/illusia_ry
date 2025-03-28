import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Controller('test')
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Example: http://localhost:5001/test/supabase
  @Get('supabase')
  async testConnection() {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('test')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return {
        status: 'Connected to Supabase!',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in testConnection:', error);
      return {
        status: 'Connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // New endpoint to test querying the public.admins table
  @Get('public-admins')
  async testPublicAdmins() {
    try {
      const data = await this.supabaseService.getPublicAdmins();
      console.log("DATA:",data);
      return {
        status: 'Successfully fetched public.admins!',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in testPublicAdmins:', error);
      return {
        status: 'Failed to fetch public.admins',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // New endpoint to test querying the public.users table
  @Get('public-users')
  async testPublicUsers() {
    try {
      const data = await this.supabaseService.getPublicUsers();
      return {
        status: 'Successfully fetched public.users!',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in testPublicUsers:', error);
      return {
        status: 'Failed to fetch public.users',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
