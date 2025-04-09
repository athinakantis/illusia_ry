import {
  Controller,
  Get,
} from '@nestjs/common';
import { GuestService } from '../services/guest.service';


// These routes are for users who are not logged in.
@Controller('items')
export class GuestController {
  constructor(private readonly guestService: GuestService) {
  }

  @Get()
  async getItems() {
    console.log('received request to backend')
    return this.guestService.getItems();
  }
}
