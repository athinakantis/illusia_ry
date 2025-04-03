import { Injectable } from '@nestjs/common';

import { SupabaseService } from './supabase.service';
import { Item } from 'src/types/item.type';
import { AuthenticatedRequest } from 'src/types/customRequest.type';


@Injectable()
export class ItemService {
  constructor(private supabaseService: SupabaseService) {}

  async getItems() {
    const { data, error } = await this.supabaseService.supabase.from('items').select('*');
    if (error) {
      console.error('Error fetching items: ', error)
      throw error;
    }
    return data
  }
async addItem(req: AuthenticatedRequest, item: Item) {
  const supabase = req['supabase'];
console.log("supabase",supabase)
    const { item_name, description, image_path, location, quantity} = item;
    const { data, error } = await supabase
    .from('items')
    .insert({
      // user_id: userId, // Maybe add a user_id field to the items table for tracking
      item_name,
      description,
      image_path,
      location,
      quantity,
      category_id: 'd1a0db85-8e03-4ba1-9ba8-5780d76e8c6d', // Default category ID, you might want to change this
    });
    console.log('item', item)

    if (error) {
      console.error('Error adding item: ', error);
      throw error;
    }
  return {
    message: 'Item added successfully',
    data: data
    
  }
  }

  async removeItem(/* userId: string, */ itemId: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      // .eq('user_id', userId);

    if (error) {
      console.error('Error deleting item: ', error);
      throw error;
    }

    return data;
  }
}
