import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { AuthGuard } from 'src/guards/role.guard';

// These routes are for users who are not logged in.
@Controller('items')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}
  

  // GET items/tags  →  all tags
  @Get("tags")
  findAll() {
    return this.guestService.getTags();
  }
  @Get("item_tags")
  findAllItemTags() {
    return this.guestService.getItemTags();
  }
  // GET items/:itemId/tags  →  tags on a specific item
  @Get('/:itemId/tags')
  findByItem(@Param('itemId') itemId: string) {
    return this.guestService.findByItem(itemId);
  }

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
    console.log("Fetching item with ID:", id);
    return this.guestService.getItemById(id);
  }

  @Get()
  async getItems() {
    return this.guestService.getPublicItems();
  }

}
