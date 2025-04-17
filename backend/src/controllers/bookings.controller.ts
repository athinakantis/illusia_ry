import { Controller, Get, Param, Body, Post, Req } from '@nestjs/common';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { BookingService } from 'src/services/bookings.service';
import { CustomRequest } from 'src/types/request.type';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  // GET /bookings → all bookings
  @Get()
  async getAllBookings( @Req() req: CustomRequest ) {
    return this.bookingService.getBookings( req );
  }

  // GET /bookings/:id → get one booking by booking_id
  @Get(':id')
  async getBookingById(
     @Req() req: CustomRequest,  @Param('id') id: string,
  ) {
    return this.bookingService.getBookingById( req,  id);
  }

  // POST /bookings → create a new booking with reservations
  @Post()
  async createBooking(@Req() req: CustomRequest, @Body() payload: CreateBookingDto) {
    return this.bookingService.createBooking(req,payload);
  }

  @Post('rpc')
  async createViaRpc(@Req() req: CustomRequest, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBookingWithItemsViaRpc(req,dto);
  }
  // POST /bookings/empty → create an empty booking
  // This is used to create a booking without any items.
  @Post('empty')
  async createEmptyBooking(@Req() req: CustomRequest) {
    return this.bookingService.createEmptyBooking(req);
  }
  // POST /bookings/:id/review
  @Post(':id/review')
  async reviewBooking(@Req() req: CustomRequest, @Param('id') bookingId: string) {
    return this.bookingService.reviewBookingAvailability(req,bookingId);
  }
}
