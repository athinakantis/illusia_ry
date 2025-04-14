import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { BookingService } from 'src/services/bookings.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  // GET /bookings → all bookings
  @Get()
  async getAllBookings(/* @Req() req: CustomRequest */) {
    return this.bookingService.getBookings(/* req */);
  }

  // GET /bookings/:id → get one booking by booking_id
  @Get(':id')
  async getBookingById(/* @Req() req: CustomRequest, */ @Param('id') id: string) {
    return this.bookingService.getBookingById(/* req, */ id);
  }
}
