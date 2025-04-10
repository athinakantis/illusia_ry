import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/types/response';
import { Database, Tables } from 'src/types/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GuestService {
  private readonly _supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    if (!url || !key) {
      throw new Error('Supabase URL and key must be provided');
    }
    // Create a client with the anonymous key for public operations
    this._supabase = createClient<Database>(url, key); // Added the Database type

  }

  async getItems(): Promise<ApiResponse<Tables<'items'>[]>> {
    try {
      const supabase = this._supabase
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

  async getItemById(itemId: string): Promise<ApiResponse<Tables<'items'>>> {
    try {
      const { data, error } = await this._supabase
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
