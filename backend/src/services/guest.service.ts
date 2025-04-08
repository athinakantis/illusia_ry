import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';

@Injectable()
export class GuestService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getItems(): Promise<ApiResponse<Tables<'items'>[]>> {
    try {
      const supabase = this.supabaseService.supabase
      console.log('Supabase in GuestService: ', supabase)
      const { data, error } = await supabase.from('items').select('*');

      if (error) {
        console.error('Error retrieving items: ', error);
        throw error;
      }

      return {
        message: 'Items retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getItems:', err);
      throw err;
    }
  }
}
