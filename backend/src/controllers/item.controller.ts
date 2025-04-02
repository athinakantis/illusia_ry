import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ItemService } from '../services/items.service';
import { User } from '@supabase/supabase-js';
import { Item } from 'src/types/item.type';

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
  
// Add this endpoint to create a new item
  @Post()
  async addItem(@Req() req: Request, @Body() body: Item) {
    try {
      if (!req['user']) {
        return {
          status: 'error',
          message: 'Unauthorized access',
        };
      }
      
      const user: Partial<User> = req['user'];

      if (!user.id) {
        throw new Error('User ID is missing');
      }

      const newItem = await this.itemService.addItem(body);

      return {
        status: 'success',
        item: newItem,
        user: {
          id: user.id,
          email: user.email,
        },
        message: 'Item added successfully',
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in addItem:`, error.message);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // Add this endpoint to delete an item by ID
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
