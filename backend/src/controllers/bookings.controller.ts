import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
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
  async getBookingById(
    /* @Req() req: CustomRequest, */ @Param('id') id: string,
  ) {
    return this.bookingService.getBookingById(/* req, */ id);
  }

  // POST /bookings → create a new booking with reservations
  @Post()
  async createBooking(@Body() payload: CreateBookingDto) {
    return this.bookingService.createBooking(payload);
  }

  @Post('rpc')
  async createViaRpc(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBookingWithItemsViaRpc(dto);
  }
}
