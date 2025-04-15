// item-reservations.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';

@Injectable()
export class ItemReservationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * @returns ApiResponse containing an array of item reservations
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all item reservations from the database.
   */
  async getAllReservations(/* req: CustomRequest */): Promise<
    ApiResponse<Tables<'item_reservations'>[]>
  > {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;

    return {
      message: 'All reservations retrieved successfully',
      data: data || [],
    };
  }

  // Search by item_id

  /**
   * @param itemId UUID of the item you want to get reservations for
   * @returns   ApiResponse containing an array of item reservations ordered by start_date
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all reservations associated with a specific item(item_id).
   */
  async getReservationsForItem(
    /* req: CustomRequest, */ itemId: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('item_id', itemId)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return {
      message: `Reservations for item ${itemId} retrieved successfully`,
      data: data || [],
    };
  }

  // Search by booking_id

  /**
   * @param bookingId UUID of the booking you want to get reservations for
   * @returns  ApiResponse containing an array of item reservations
   * @throws Error if there is an issue with the Supabase query
   * @description This method retrieves all reservations associated with a specific booking(booking_id).
   */
  async getReservationsByBooking(
    /* req: CustomRequest, */ bookingId: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('booking_id', bookingId);

    if (error) throw error;

    return {
      message: `Reservations for booking ${bookingId} retrieved successfully`,
      data: data || [],
    };
  }

  // Search by user_id

  /**
   * @param userId UUID of the user whose reservations you want to retrieve
   * @returns ApiResponse containing an array of bookings, each with its associated item reservations
   * @throws Error if there is an issue with the Supabase RPC call
   * @description
   * This method retrieves all bookings for a given user, with each booking grouped
   * together with its corresponding item reservations. It calls the
   * Supabase RPC function `get_user_reservations_grouped`, which returns results in the following structure:
   *
   * [
   *   {
   *     booking_id: UUID,
   *     user_id: UUID,
   *     reservations: [
   *       {
   *         id: UUID,
   *         item_id: UUID,
   *         start_date: Date,
   *         end_date: Date,
   *         quantity: number,
   *         created_at: timestamp
   *       },
   *       ...
   *     ]
   *   },
   *   ...
   * ]
   *
   * This is useful for displaying a user's full reservation history in a grouped format,
   * ideal for dashboards or account overviews.
   */
  async getReservationsByUser(
    /* req: CustomRequest, */ userId: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];
    const { data, error } = await supabase.rpc(
      'get_user_reservations_grouped',
      {
        user_id: userId,
      },
    );

    if (error) throw error;
    return {
      message: `Reservations for user ${userId} retrieved successfully`,
      data: data || [],
    };
  }

  // Search by date range
  
  /**
   * @param from Start date of the range
   * @param to   End date of the range
   * @returns    ApiResponse containing an array of item reservations within the specified date range
   */
  async getReservationsInDateRange(
    /* req: CustomRequest, */ from: string,
    to: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];
    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .lte('start_date', to) // start before or on "to"
      .gte('end_date', from) // end after or on "from"
      .order('start_date', { ascending: true });

    if (error) throw error;

    return {
      message: `Reservations between ${from} and ${to} retrieved successfully`,
      data: data || [],
    };
  }

  // Search by item and date range
  /**
   * @param itemId UUID of the item you want to get reservations for
   * @param from   Start date of the range
   * @param to     End date of the range
   * @returns
   */
  async getReservationsForItemInDateRange(
    /* req: CustomRequest, */ itemId: string,
    from: string,
    to: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('item_id', itemId)
      .lte('start_date', to)
      .gte('end_date', from)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return {
      message: `Reservations for item ${itemId} between ${from} and ${to} retrieved successfully`,
      data: data || [],
    };
  }

  async getReservationsByStartDate(
    /* req: CustomRequest, */ startDate: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('start_date', startDate);

    if (error) throw error;

    return {
      message: `Reservations starting on ${startDate} retrieved successfully`,
      data: data || [],
    };
  }

  async getReservationsByEndDate(
    /* req: CustomRequest, */ endDate: string,
  ): Promise<ApiResponse<Tables<'item_reservations'>[]>> {
    const supabase = this.supabaseService.getClient();
    // const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('item_reservations')
      .select('*')
      .eq('end_date', endDate);

    if (error) throw error;

    return {
      message: `Reservations ending on ${endDate} retrieved successfully`,
      data: data || [],
    };
  }


  async createReservation(payload: {
    booking_id: string;
    item_id: string;
    start_date: string;
    end_date: string;
    quantity: number;
  }): Promise<ApiResponse<Tables<'item_reservations'>>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('item_reservations')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return {
      message: 'Reservation created successfully',
      data,
    };
  }
}
