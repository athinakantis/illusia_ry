import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { GuestService } from '../services/guest.service';


// These routes are for users who are not logged in.
@Controller('items')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}
  
  @Get('categories')
  async getAllCategories() {
    return this.guestService.getCategories();
  }

  @Get(`filter`)
  async getFilteredItems(@Query('category') categories: string) {
    const formattedCategories = categories.split(' ')
    formattedCategories.map(cat => cat.replace('-', ' '))
    return this.guestService.getItemsByCategories(formattedCategories);
  }

  @Get(':id')
  async getItemById(@Param('id') id: string) {
    console.log("Fetching item with ID:", id);
    return this.guestService.getItemById(id);
  }

  @Get()
  async getItems() {
    return this.guestService.getItems();
  }

}
