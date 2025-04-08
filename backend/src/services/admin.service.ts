import { Injectable } from '@nestjs/common';
import { Tables } from '../types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { CustomRequest } from '../types/request.type';
import { ApiResponse } from '../types/response';

@Injectable()
export class AdminService {
  async getFrontendItemView(req: CustomRequest): Promise<ApiResponse<Tables<'frontend_item_view'>[]>> {
    const supabase: SupabaseClient = req['supabase'];

    const { data, error } = await supabase
      .from('frontend_item_view')
      .select('*');

    if (error) {
      console.error('Error fetching view data:', error);
      throw error;
    }

    return {
      message: 'Successfully fetched frontend item view',
      data: data || [],
    };
  }
}