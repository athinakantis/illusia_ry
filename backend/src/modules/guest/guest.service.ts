import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
  
  getPublicClient(): SupabaseClient {
    return this._supabase;
  }
  
  async getPublicItems(): Promise<ApiResponse<Tables<'items'>[]>> {
    try {
      const { data, error } = await this._supabase
      .from('new_items')
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
        .from('new_items')
        .select('*');
      if (error) throw error;
      return { message: 'All items retrieved', data: data || [] };
    } catch (err) {
      console.error('Error in getItemsAdmin:', err);
      throw err;
    }
  }

  async getTags(): Promise<ApiResponse<Tables<'tags'>[]>> {
    try {
      const { data, error } = await this._supabase
        .from('tags')
        .select('*');
      if (error) {
        throw new HttpException(
          `Failed to retrieve tags: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: 'All tags retrieved', data: data || [] };
    } catch (err) {
      throw new HttpException(
        `Unexpected error retrieving tags: ${err instanceof Error ? err.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      
    }
  }

  async getItemTags(): Promise<ApiResponse<Tables<"item_tags">[]>> {
    try {
      const { data, error } = await this._supabase
        .from('item_tags')
        .select('*');
      if (error) {
        throw new HttpException(
          `Failed to retrieve item–tag relations: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { 
        message: 'All tags retrieved',
        data: data || []
      };

    } catch (err) {
      throw new HttpException(
        `Unexpected error retrieving item-tag relations: ${err instanceof Error ? err.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Returns the full tag objects that belong to a single item.
   * Reads through the item_tags junction and embeds the matching
   * tag rows so the client gets tag_id, tag_name, description, created_at, …
   */
  async findByItem(itemId: string): Promise<ApiResponse<Tables<'tags'>[]>> {
    try {
      const { data, error } = await this._supabase
        .from('item_tags')
        // embed all columns that exist on the tags table
        .select('tags ( tag_id, tag_name, description, created_at )')
        .eq('item_id', itemId);

      if (error) {
        throw new HttpException(
          `Failed to retrieve tags for item ${itemId}: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // row.tags might be either an object or an array depending on PostgREST config
      const tags: Tables<'tags'>[] = (data ?? []).flatMap((row) => {
       
        const embedded = row.tags;
        return Array.isArray(embedded) ? embedded : [embedded];
      });

      return {
        message: `Tags for item ${itemId} retrieved successfully`,
        data: tags,
      };
    } catch (err) {
      throw new HttpException(
        `Unexpected error retrieving tags for item ${itemId}: ${err instanceof Error ? err.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
