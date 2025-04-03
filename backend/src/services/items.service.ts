import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { Tables } from 'src/types/supabase';
import { CustomRequest } from 'src/types/customReq.type';
@Injectable()
export class ItemService {
  private readonly _supabase: SupabaseService; // This was set to SupabaseClient before
  constructor(private configService: ConfigService) {}

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
    const user = req['user'];
    const {
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id,
    } = item;
    const { data, error } = await supabase.from('items').insert({
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id,
    })
    .select();
  

    if (error) {
      console.error('Error adding item: ', error);
      throw error;
    }
    return {
      message: 'Item added successfully',
      data: data,
      user: {
        id: user?.id,
        email: user?.email,
      },
    };
  }

  async updateItem(req: CustomRequest, itemId: string, item: Partial<Tables<'items'>>) {
    const supabase = req['supabase'];
    const user = req['user'];
    const { item_name, description, image_path, location, quantity, category_id } = item;
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
      .eq('item_id', itemId);

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
