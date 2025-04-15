import { Controller, Get, Param, Query, Body, Post } from "@nestjs/common";
import { ItemReservationService } from "src/services/reservations.service";

@Controller('reservations')
export class ItemReservationsController {
  constructor(private readonly itemReservationService: ItemReservationService) {}

  // GET /reservations
  @Get()
  async getAllReservations() {
    return this.itemReservationService.getAllReservations();
  }

  // POST /reservations
  @Post()
  async createReservation(@Body() dto: {
    booking_id: string;
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
  }) {
    return this.itemReservationService.createReservation(dto);
  }

  // GET /reservations/item/:itemId
  @Get('item/:itemId')
  async getByItem(@Param('itemId') itemId: string) {
    return this.itemReservationService.getReservationsForItem(itemId);
  }

  // GET /reservations/booking/:bookingId
  @Get('booking/:bookingId')
  async getByBooking(@Param('bookingId') bookingId: string) {
    return this.itemReservationService.getReservationsByBooking(bookingId);
  }

  // GET /reservations/user/:userId
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.itemReservationService.getReservationsByUser(userId);
  }

  // GET /reservations/date-range?from=2025-04-14&to=2025-04-14
  // Example : http://localhost:5001/reservations/date-range?from=2025-04-16&to=2025-04-16
  @Get('date-range')
  async getByDateRange(@Query('from') from: string, @Query('to') to: string) {
    return this.itemReservationService.getReservationsInDateRange(from, to);
  }

  // GET /reservations/item/:itemId/date-range?from=YYYY-MM-DD&to=YYYY-MM-DD
  // Example : http://localhost:5001/reservations/item/d435e94d-9d98-4e7f-b3dd-20b558cb4185/date-range?from=2025-04-16&to=2025-04-16

  @Get('item/:itemId/date-range')
  async getByItemAndDateRange(
    @Param('itemId') itemId: string,
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    return this.itemReservationService.getReservationsForItemInDateRange(itemId, from, to);
  }

  // GET /reservations/start-date/:startDate
  // Only finds a reservation that starts EXACTLY on that date.
  @Get('start-date/:startDate')
  async getByStartDate(@Param('startDate') startDate: string) {
    return this.itemReservationService.getReservationsByStartDate(startDate);
  }

  // GET /reservations/end-date/:endDate
    // Only finds a reservation that ends EXACTLY on that date.
    // Example : http://localhost:5001/reservations/end-date/2025-04-23
  @Get('end-date/:endDate')
  async getByEndDate(@Param('endDate') endDate: string) {
    return this.itemReservationService.getReservationsByEndDate(endDate);
  }
  
}