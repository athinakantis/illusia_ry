import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Tables } from 'src/types/supabase';
import { CustomRequest } from 'src/types/customReq.type';
@Injectable()
export class ItemService {
  constructor(private readonly SupabaseService: SupabaseService) {}

  async getItems(req: CustomRequest) {
    const supabase = req['supabase'];
    try {
      const { data, error } = await supabase.from('items').select('*');

      if (error) {
        console.error('Error retrieving items: ', error);
        throw error;
      }

      return {
        message: 'Items retrieved successfully',
        data,
      };
    } catch (err) {
      console.error('Unexpected error in getItems:', err);
      throw err;
    }
  }

  // Below is an example of how to type an item from the items table: item: Tables<"items">
  async addItem(req: CustomRequest, item: Tables<'items'>) {
    const supabase = req['supabase'];

    const {
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id,
    } = item;
    const { data, error } = await supabase
      .from('items')
      .insert({
        item_name,
        description,
        image_path,
        location,
        quantity,
        category_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding item: ', error);
      throw error;
    }
    // Using the SupabaseService to log the action(Service Role Key)
    await this.SupabaseService.logAction({
      user_id: req.user.id,
      action_type: 'ADD_ITEM',
      target_id: data.item_id,
      metadata: { item_name: data.item_name },
    });
    return {
      message: 'Item added successfully',
      data: data,
    };
  }

  async updateItem(
    req: CustomRequest,
    itemId: string,
    item: Partial<Tables<'items'>>,
  ) {
    const supabase = req['supabase'];
    const user = req['user'];
    const {
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id,
    } = item;
    const { data, error } = await supabase
      .from('items')
      .update({
        item_name,
        description,
        image_path,
        location,
        quantity,
        category_id,
      })
      .eq('item_id', itemId)
      .select()
      .single();
    // Using the SupabaseService to log the action(Service Role Key)
    await this.SupabaseService.logAction({
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
      user: {
        id: user?.id,
        email: user?.email,
      },
    };
  }

  async deleteItem(req: CustomRequest, itemId: string) {
    const supabase = req['supabase'];
    const user = req['user'];
    const { data, error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', itemId)
      .select()
      .single();

    // Using the SupabaseService to log the action(Service Role Key)
    await this.SupabaseService.logAction({
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
      user: {
        id: user?.id,
        email: user?.email,
      },
    };
  }
}
