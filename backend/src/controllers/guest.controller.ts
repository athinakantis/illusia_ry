import {
  Controller,
  Get,
} from '@nestjs/common';
import { GuestService } from '../services/guest.service';

@Controller('items')
export class GuestController {
  constructor(private readonly itemService: GuestService) {
  }

  @Get()
  async getItems() {
    console.log('received request to backend')
    return this.itemService.getItems();
  }
}
