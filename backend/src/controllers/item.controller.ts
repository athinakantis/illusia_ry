import { Controller, Get } from '@nestjs/common';
import { ItemService } from '../services/items.service';

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
  

}
