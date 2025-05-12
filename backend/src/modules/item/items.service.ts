import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Tables } from 'src/types/supabase';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';


@Injectable()
export class ItemService {
  constructor(
    private readonly supabaseService: SupabaseService
  ) {}

  async addItem(req: CustomRequest, item: Partial<Tables<'items'>>): Promise<ApiResponse<Tables<'items'>>> {

const supabase = req['supabase'];

    const {
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id,
      visible,
    } = item;

    try {
      // Insert the new item into the database
      const { data, error } = await supabase
        .from('items')
        .insert({
          item_name,
          description,
          image_path,
          location,
          quantity,
          category_id,
          visible: visible ?? true
          // Assuming created_at and item_id are handled by the database
        })
        .select() // Select the newly created item to return it
        .single(); // Expecting a single row back

      if (error) {
        console.error('Error adding item: ', error);
        throw error;
      }
      return {
        message: 'Item added successfully',
        data: data,
      };
    } catch (err) {
      console.error('Failed to add item:', err);
      // Consider throwing a more specific HTTP exception if needed
      throw new Error('Failed to add item');
    }
  }



  async updateItem(
    req: CustomRequest,
    itemId: string,
    item: Partial<Tables<'items'>>
  ): Promise<ApiResponse<Tables<'items'>>> {
    const supabase = req['supabase'];

    const { item_name, description, image_path, location, quantity, category_id, visible } = item;

    const { data, error } = await supabase
      .from('items')
      .update({
        item_name,
        description,
        image_path,
        location,
        quantity,
        category_id,
        visible,
      })
      .eq('item_id', itemId)
      .select()
      .single();


    if (error) {
      console.error('Error updating item: ', error);
      throw error;
    }

    return {
      message: `Item: ${itemId} updated successfully`,
      data: data,
    };
  }

  async deleteItem(
    req: CustomRequest,
    itemId: string,
  ): Promise<ApiResponse<Tables<'items'>>> {
    const supabase = req['supabase'];
    const { data, error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', itemId)
      .select()
      .single();


    if (error) {
      console.error('Error deleting item: ', error);
      throw error;
    }

    return {
      message: `Item: ${itemId} removed successfully`,
      data: data,
    };
  }
}
