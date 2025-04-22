import { BadRequestException, Injectable } from '@nestjs/common';
import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';
import { CustomRequest } from 'src/types/request.type';

@Injectable()
export class ItemReservationService {


  /**
   * @returns ApiResponse containing an array of item reservations
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all item reservations from the database.
   */
  async getAllReservations(req: CustomRequest): Promise<
    ApiResponse<Tables<'item_reservations'>[]>
  > {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'All reservations retrieved successfully',
      data: data ?? [],
    };
  }

  // Search by item_id

  /**
   * @param itemId UUID of the item you want to get reservations for
   * @returns   ApiResponse containing an array of item reservations ordered by start_date
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all reservations associated with a specific item(item_id).
   */
  async getReservationsForItem(req: CustomRequest, itemId: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('item_id', itemId)
      .order('start_date', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations for item ${itemId} retrieved successfully`,
      data: data ?? [],
    };
  }

  // Search by booking_id

  /**
   * @param bookingId UUID of the booking you want to get reservations for
   * @returns  ApiResponse containing an array of item reservations
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all reservations associated with a specific booking(booking_id).
   */
  async getReservationsByBooking(req: CustomRequest, bookingId: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('booking_id', bookingId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations for booking ${bookingId} retrieved successfully`,
      data: data ?? [],
    };
  }

  // Search by date range
  
  /**
   * @param from Start date of the range
   * @param to   End date of the range
   * @returns    ApiResponse containing an array of item reservations within the specified date range
   */
  async getReservationsInDateRange(req: CustomRequest, from: string, to: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];
    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .lte('start_date', to) // start before or on "to"
      .gte('end_date', from) // end after or on "from"
      .order('start_date', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations between ${from} and ${to} retrieved successfully`,
      data: data ?? [],
    };
  }

  // Search by item and date range
  /**
   * @param itemId UUID of the item you want to get reservations for
   * @param from   Start date of the range
   * @param to     End date of the range
   * @returns
   */
  async getReservationsForItemInDateRange(req: CustomRequest, itemId: string, from: string, to: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('item_id', itemId)
      .lte('start_date', to)
      .gte('end_date', from)
      .order('start_date', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations for item ${itemId} between ${from} and ${to} retrieved successfully`,
      data: data ?? [],
    };
  }

  async getReservationsByStartDate(req: CustomRequest, startDate: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('start_date', startDate);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations starting on ${startDate} retrieved successfully`,
      data: data ?? [],
    };
  }

  async getReservationsByEndDate(req: CustomRequest, endDate: string): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('end_date', endDate);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Reservations ending on ${endDate} retrieved successfully`,
      data: data ?? [],
    };
  }

  // This method creates a new reservation in the item_reservations table.
  // In english: It adds an item to a booking.
  // It does not check for availability.
  async createReservation(req: CustomRequest, payload: {
    booking_id: string;
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
  }): Promise<ApiResponse<Tables<'item_reservations'>>> {
    const supabase = req['supabase'];
 
    const { data, error } = await supabase
      .from('item_reservations')
      .insert(payload)
      .select()
      .single();
 
    if (error) {
      throw new BadRequestException(error.message); // Controlled response
    }
 
    return {
      message: 'Reservation created successfully',
      data,
    };
  }

  /**
   * Update an existing reservation row that belongs to the given booking.
   *
   * The caller may supply any subset of the editable columns.  Columns
   * not included in `payload` remain unchanged.
   *
   * RLS guarantees:
   *   • Ordinary users can update only reservations tied to their own booking
   *   • Admin / Head‑Admin can update any reservation
   */
  async updateReservation(
    req: CustomRequest,
    bookingId: string,
    reservationId: string,
    payload: Partial<{
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }>,
  ): Promise<ApiResponse<Tables<'item_reservations'>>> {
    const supabase = req['supabase'];   

    // Reject empty payloads to avoid accidental no‑op updates
    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('Update payload is empty');
    }

    // Perform the update, ensuring both id and booking_id match
    const { data, error } = await supabase
      .from('item_reservations')
      .update(payload)
      .eq('id', reservationId)
      .eq('booking_id', bookingId)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new BadRequestException(
        'Reservation not found or not permitted to update(Check Booking/Reservation ID)',
      );
    }

    return {
      message: 'Reservation updated successfully',
      data,
    };
  }

   // Delete one or many reservations that belong to a booking
    /**
     * @param bookingId Booking ID of the reservations to delete
     * @param reservationIds  Array of reservation IDs to delete
     * @example
     * DELETE /reservations/booking/:bookingId
     * Body: 
     * {
     * "reservationIds": [
     * "54390b8a-1030-4277-b5d3-2711aca4a137",
     * "42b11fb6-d03f-483a-97fa-97a067c8a680"
     * ]
     * }
     */
    async deleteReservations(
      req: CustomRequest,
      bookingId: string,
      reservationIds: string[],
    ): Promise<ApiResponse<{ deleted: number; deletedItems: Tables<'item_reservations'>[] }>> {
      const supabase = req['supabase'];
  
      if (!reservationIds.length) {
        return { message: 'Nothing to delete', data: { deleted: 0, deletedItems: [] } };
      }
  
      const { data, error } = await supabase
        .from('item_reservations')
        .delete()
        .eq('booking_id', bookingId)   // make sure the rows belong to that booking
        .in('id', reservationIds)
        .select();

      if (!data || data.length === 0) {
        throw new BadRequestException('Booking not found or no reservations to delete');
      }
      // Check if the number of deleted rows matches the number of requested deletions
      if (data.length !== reservationIds.length) {
        throw new BadRequestException('Not all reservations were deleted');
      }

      // Check for errors
      if (error) {
        throw new BadRequestException(error);
      }
  
      return {
        message: 'Reservations deleted successfully',
        data: { 
          deleted: data ? data.length : 0,
          deletedItems: data  
        },
      };
    }
}
