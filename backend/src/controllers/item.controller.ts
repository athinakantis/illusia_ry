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
import { UserService } from '../services/user.service';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';

@Controller('items')
export class ItemController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addItem(@Req() req: CustomRequest, @Body() item: Tables<'items'>) {
    return this.userService.addItem(req, item);
  }

  @Patch(':id')
  async updateItem(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() item: Partial<Tables<'items'>>,
  ) {
    return this.userService.updateItem(req, id, item);
  }

  @Delete(':id')
  async deleteItem(@Req() req: CustomRequest, @Param('id') id: string) {
    return this.userService.deleteItem(req, id);
  }
}
