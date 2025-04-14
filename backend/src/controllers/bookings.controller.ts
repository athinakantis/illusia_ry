import {
  Controller,
  Get,
  Param,
//   Req,
} from '@nestjs/common';
import { BookingService } from 'src/services/bookings.service';
// import { CustomRequest } from 'src/types/request.type';



// These routes are for users who are not logged in.
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

  // GET /bookings/user/:userId → get bookings by user ID
  @Get('user/:userId')
  async getBookingsByUserId(/* @Req() req: CustomRequest, */ @Param('userId') userId: string) {
    return this.bookingService.getBookingsByUserId(/* req, */ userId);
  }

  // GET /bookings/item/:itemId → get bookings by item ID
  @Get('item/:itemId')
  async getBookingsByItemId(/* @Req() req: CustomRequest, */ @Param('itemId') itemId: string) {
    return this.bookingService.getBookingsByItemId(/* req, */ itemId);
  }

  // GET /bookings/date/:date → get bookings by date (e.g. 2025-04-14)
  @Get('date/:date')
  async getBookingsByDate(/* @Req() req: CustomRequest, */ @Param('date') date: string) {
    return this.bookingService.getBookingsByDate(/* req, */ date);
  }
}
