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

  async getPublicItems(): Promise<ApiResponse<Tables<'items'>[]>> {
    try {
      const { data, error } = await this._supabase
      .from('items')
      .select('*')
      .eq("visible", true)

      if (error) {
        console.error('Error retrieving items: ', error);
        throw error;
      }

      return {
        message: 'Items retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getPublicItems:', err);
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

  async getCategories() {
    try {
      const { data, error } = await this._supabase
      .from('categories')
      .select('category_id, category_name, image_path')

    if (error) {
      console.error('Error retrieving item: ', error);
      throw error;
    }

    return {
      message: `Categories retrieved successfully`,
      data: data || null,
    }; 
    } catch (err) {
      console.error('Unexpected error in getItemById:', err);
      throw err;
    }
  }

  async getItemsByCategories(categories: string[]) {
    try {
      const { data, error } = await this._supabase
      .from('items')
      .select('*, categories!inner(category_name)')
      .in('categories.category_name', categories);
      console.log(data)

    if (error) {
      console.error('Error retrieving item: ', error);
      throw error;
    }

    return {
      message: `Categories retrieved successfully`,
      data: data || null,
    }; 
    } catch (err) {
      console.error('Unexpected error in getItemById:', err);
      throw err;
    }
  }
// Fetches all items including those that are not visible
  async getItemsAdmin(): Promise<ApiResponse<Tables<'items'>[]>> {
    try {
      const { data, error } = await this._supabase
        .from('items')
        .select('*');
      if (error) throw error;
      return { message: 'All items retrieved', data: data || [] };
    } catch (err) {
      console.error('Error in getItemsAdmin:', err);
      throw err;
    }
  }
}
