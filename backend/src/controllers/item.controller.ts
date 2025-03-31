import { Controller, Get } from '@nestjs/common';
import { ItemService } from '../services/items.service';

@Controller('items')
export class TestItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async testItems() {
    try {
      const data = await this.itemService.getItems();
      return {
        status: 'Successfully fetched items!',
        data,
        timestamp: new Date().toISOString(),
      };
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
