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

    async getItemById( itemId: string): Promise<ApiResponse<Tables<'items'>>> {
      try {
        const { data, error } = await this.supabaseService.supabase
          .from('items')
          .select('*')
          .eq('item_id', itemId)
          .single();
        if (error) {
          console.error('Error retrieving item: ', error);
          throw error;
        }
        return {
          message: `Item ${itemId} retrieved successfully`,
          data: data || null,
        };
      } catch (err) {
        console.error('Unexpected error in getItemById:', err);
        throw err;
      }
    }
}
