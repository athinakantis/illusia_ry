import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ItemService } from '../services/items.service';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getItems(@Req() req: CustomRequest) {
    return this.itemService.getItems(req);
  }

  @Post()
  async addItem(@Req() req: CustomRequest, @Body() item: Tables<'items'>) {
    return this.itemService.addItem(req, item);
  }

  @Patch(':id')
  async updateItem(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() item: Partial<Tables<'items'>>,
  ) {
    return this.itemService.updateItem(req, id, item);
  }

  @Delete(':id')
  async deleteItem(@Req() req: CustomRequest, @Param('id') id: string) {
    return this.itemService.deleteItem(req, id);
  }
}
