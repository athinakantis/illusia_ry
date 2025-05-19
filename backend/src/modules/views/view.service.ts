import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';


@Injectable()
export class ViewsService {
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