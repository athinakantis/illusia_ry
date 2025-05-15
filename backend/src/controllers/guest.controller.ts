import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuestService } from '../services/guest.service';
import { AuthGuard } from 'src/guards/auth.guard';


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

  @Get('admin')
  @UseGuards(AuthGuard('Admin',"Head Admin"))
  async getItemsAdmin() {
    return this.guestService.getItemsAdmin();
  }

  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.guestService.getItemById(id);
  }

  @Get()
  async getItems() {
    return this.guestService.getPublicItems();
  }

}
