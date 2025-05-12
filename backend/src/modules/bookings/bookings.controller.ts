import { Controller, Get, Param, Body, Post, Req, Patch, Delete } from '@nestjs/common';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { BookingService } from 'src/modules/bookings/bookings.service';
import { CustomRequest } from 'src/types/request.type';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }
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
  // GET /bookings/user/:id → get all bookings for a user
  @Get('user/:id')
  async getBookingsByUserId( @Req() req: CustomRequest, @Param('id') user_id: string ) {
    if (!user_id) {
      return {
        message: 'User ID is required',
        error: 'User ID is required',
      };
    }
    if (user_id.length !== 36) {
      return {
        message: 'Invalid User ID',
        error: 'Invalid User ID',
      };
    }
    return this.bookingService.getUserBookings( req, user_id );
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

  // UPDATE /bookings/:id → update a booking status
  @Patch(':id')
  async updateBookingStatus(@Req() req: CustomRequest, @Param('id') bookingId: string, @Body() payload: { status: string }) {
    return this.bookingService.updateBookingStatus(req, bookingId, payload.status);
  }
  // DELETE /bookings/:id → delete a booking by booking_id
  @Delete(':id')
  async deleteBooking(@Req() req: CustomRequest, @Param('id') id: string) {
    return this.bookingService.deleteBooking(req, id);
  }

  @Get(`upcoming/:amount`)
  async getUpcomingBookings(@Req() req: CustomRequest, @Param('amount') amount: string) {
    return this.bookingService.getUpcomingBookings(req, amount)
  }
}
