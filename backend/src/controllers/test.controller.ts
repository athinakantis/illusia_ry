import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Controller('test')
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Example: http://localhost:5001/test/supabase
  @Get("supabase")
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
}