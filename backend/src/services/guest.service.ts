import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GuestService {
    private readonly _supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    
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
}
