import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ItemService } from '../services/items.service';
import { User } from '@supabase/supabase-js';
import { Item } from 'src/types/item.type';
import { AuthenticatedRequest } from 'src/types/customRequest.type';


@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItems() {
    try {
      const data = await this.itemService.getItems();
      return data
    } catch (error) {
      console.error('Error in testItems', error);
      return {
        status: 'Failed to fetch items',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post()
  async addItem(@Req() req: AuthenticatedRequest, @Body() item: Item) {
    const supabase = req.supabase;

    const { item_name, description, image_path, location, quantity } = item;
    const { data, error } = await supabase
      .from('items')
      .insert({
        item_name,
        description,
        image_path,
        location,
        quantity,
        category_id: 'd1a0db85-8e03-4ba1-9ba8-5780d76e8c6d', // Default category ID
      });

    console.log('item', item);

    if (error) {
      console.error('Error adding item: ', error);
      throw error;
    }

    return {
      status: 'success',
      message: 'Item added successfully',
      data: data,
      
    }
  }

  @Delete('/:id')
  async deleteItem(@Req() req: Request, @Param('id') item_id: string) {
    try {
      if (!req['user']) {
        return {
          status: 'error',
          message: 'Unauthorized access',
        };
      }
      const user: Partial<User> = req['user'];
      const result = await this.itemService.removeItem(item_id);

      return {
        status: 'success',
        result,
        user: {
          id: user.id,
          email: user.email,
        },
        message: `Item with ID ${item_id} deleted successfully`,

      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in deleteItem:`, error.message);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
