import { Controller, Get, Param, Query, Body, Post, Delete, Req, Patch } from "@nestjs/common";
import { UpdateReservationDto } from "src/modules/reservations/dto/updateReservations.dto";
import { ItemReservationService } from "src/modules/reservations/reservations.service";
import { CustomRequest } from "src/types/request.type";

@Controller('reservations')
export class ItemReservationsController {
  constructor(private readonly itemReservationService: ItemReservationService) {}

  // GET /reservations
  @Get()
  async getAllReservations(@Req() req: CustomRequest) {
    return this.itemReservationService.getAllReservations(req);
  }

  // GET /reservations/item/:itemId
  @Get('item/:itemId')
  async getByItem(@Req() req: CustomRequest, @Param('itemId') itemId: string) {
    return this.itemReservationService.getReservationsForItem(req, itemId);
  }

  // GET /reservations/booking/:bookingId
  @Get('booking/:bookingId')
  async getByBooking(@Req() req: CustomRequest, @Param('bookingId') bookingId: string) {
    return this.itemReservationService.getReservationsByBooking(req, bookingId);
  }

  // GET /reservations/date-range?from=2025-04-14&to=2025-04-14
  // Example : http://localhost:5001/reservations/date-range?from=2025-04-16&to=2025-04-16
  @Get('date-range')
  async getByDateRange(@Req() req: CustomRequest, @Query('from') from: string, @Query('to') to: string) {
    return this.itemReservationService.getReservationsInDateRange(req, from, to);
  }

  // GET /reservations/item/:itemId/date-range?from=YYYY-MM-DD&to=YYYY-MM-DD
  // Example : http://localhost:5001/reservations/item/d435e94d-9d98-4e7f-b3dd-20b558cb4185/date-range?from=2025-04-16&to=2025-04-16

  @Get('item/:itemId/date-range')
  async getByItemAndDateRange(
    @Req() req: CustomRequest,
    @Param('itemId') itemId: string,
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    return this.itemReservationService.getReservationsForItemInDateRange(req, itemId, from, to);
  }

  // GET /reservations/start-date/:startDate
  // Only finds a reservation that starts EXACTLY on that date.
  @Get('start-date/:startDate')
  async getByStartDate(@Req() req: CustomRequest, @Param('startDate') startDate: string) {
    return this.itemReservationService.getReservationsByStartDate(req, startDate);
  }

  // GET /reservations/end-date/:endDate
    // Only finds a reservation that ends EXACTLY on that date.
    // Example : http://localhost:5001/reservations/end-date/2025-04-23
  @Get('end-date/:endDate')
  async getByEndDate(@Req() req: CustomRequest, @Param('endDate') endDate: string) {
    return this.itemReservationService.getReservationsByEndDate(req, endDate);
  }

  // POST /reservations
  // This endpoint is used to add items to a booking.
  @Post()
  async createReservation(
    @Req() req: CustomRequest,
    @Body() dto: {
      booking_id: string;
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }
  ) {
    return this.itemReservationService.createReservation(req, dto);
  }

    /**
   * DELETE /reservations/booking/:bookingId
   * Body: { reservationIds: string[] }
   * It takes a bookingId as a parameter and an array of reservationIds in the body.
   * It deletes the reservations from the item_reservations table.
   * @param req - The request object
   * @param bookingId - The ID of the booking
   * @param reservationIds - The IDs of the reservations to be deleted: { reservationIds: string[] }
   * @returns - The result of the deletion
   * @example
   * DELETE /reservations/booking/12345
   * {
   *   "reservationIds": ["67890", "54321"]
   * }
   */
    @Delete('booking/:bookingId')
    async deleteReservations(
      @Req() req: CustomRequest,
      @Param('bookingId') bookingId: string,
      @Body('reservationIds') reservationIds: string[],
    ) {
      return this.itemReservationService.deleteReservations(
        req,
        bookingId,
        reservationIds,
      );
    }
  
  // PATCH /reservations/booking/:bookingId/:reservationId
  // This endpoint is used to update a reservation.
  @Patch('booking/:bookingId/:reservationId')
  async updateReservation(
    @Req() req: CustomRequest,
    @Param('bookingId') bookingId: string,
    @Param('reservationId') reservationId: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.itemReservationService.updateReservation(
      req,
      bookingId,
      reservationId,
      dto,
    );
  }
}