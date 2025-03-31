import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';

@Controller('test')
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // This endpoint is protected. The JWT guard will ensure a valid token is present.
  @Get("supabase")
  @UseGuards(AuthGuard('jwt'))
  async testConnection(@Req() req: Request & { user: any }) {
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
        user: req.user,
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