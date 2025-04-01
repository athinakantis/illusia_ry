
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../services/supabase.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getItems() {
    try {
      // Query the 'items' table in Supabase
      const { data, error } = await this.supabaseService.supabase
        .from('items')
        .select('*');

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}