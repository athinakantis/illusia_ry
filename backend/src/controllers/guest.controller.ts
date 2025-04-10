import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { GuestService } from '../services/guest.service';


// These routes are for users who are not logged in.
@Controller('items')
export class GuestController {
  constructor(private readonly guestService: GuestService) {
  }
  @Get(':id')
  async getItemById(@Param('id') id: string) {
    console.log("Fetching item with ID:", id);
    return this.guestService.getItemById(id);
  }

  @Get()
  async getItems() {
    console.log('received request to backend')
    return this.guestService.getItems();
  }


}
