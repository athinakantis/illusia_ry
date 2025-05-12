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

      // Log the action using the SupabaseService
      // Make sure req.user.id is available from your AuthMiddleware
      if (req.user?.id) {
        await this.supabaseService.logAction({
          user_id: req.user.id,
          action_type: 'CREATE_ITEM',
          target_id: data.item_id, // Use the ID of the newly created item
          metadata: { item_name: data.item_name },
        });
      } else {
        console.warn('User ID not found in request for logging action.');
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

    // Using the SupabaseService to log the action(Service Role Key)
    await this.supabaseService.logAction({
      user_id: req.user.id,
      action_type: 'UPDATE_ITEM',
      target_id: itemId,
      metadata: { item_name: data.item_name },
    });

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

    // Using the SupabaseService to log the action(Service Role Key)
    await this.supabaseService.logAction({
      user_id: req.user.id,
      action_type: 'DELETE_ITEM',
      target_id: itemId,
      metadata: { item_name: data.item_name },
    });

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
