import { BadRequestException, Injectable } from '@nestjs/common';
import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';
import { SupabaseService } from './supabase.service';


@Injectable()
export class BookingService {
    constructor(private readonly supabaseService: SupabaseService) {}


  // These use the SERVICE ROLE KEY for for now. You wont be able to test policies with this enabled.
  // We will switch back to using the users anon key once we have the UI to test them.

  async getBookings(/* req: CustomRequest */): Promise<ApiResponse<Tables<'bookings'>[]>> {
    // const supabase = req['supabase'];

    const { data, error } = await this.supabaseService.getClient()
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Bookings retrieved successfully',
      data: data || [],
    };
  }

  async getBookingById(/* req: CustomRequest, */ id: string): Promise<ApiResponse<Tables<'bookings'>>> {
    // const supabase = req['supabase'];

    const { data, error } = await this.supabaseService.getClient()
      .from('bookings')
      .select('*')
      .eq('booking_id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: `Booking ${id} retrieved successfully`,
      data,
    };
  }
// Create booking with attached reservations(items). Does not check for availability.
  // This is a simple insert into the bookings table and then an insert into the item_reservations table.
  async createBooking(payload: {
    user_id: string;
    items: {
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }[];
  }): Promise<ApiResponse<{ booking_id: Tables<'bookings'>['booking_id']; reservations: Tables<'item_reservations'>[] }>> {
    const supabase = this.supabaseService.getClient();
  
    // 1. Insert the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({ user_id: payload.user_id })
      .select()
      .single();
  
    if (bookingError) {
      throw new BadRequestException(bookingError.message);
    }
  
    const booking_id = bookingData.booking_id;
  
    // 2. Insert item reservations
    const reservationRows = payload.items.map((item) => ({
      booking_id,
      item_id: item.item_id,
      start_date: item.start_date,
      end_date: item.end_date,
      quantity: item.quantity,
    }));
  
    const { error: reservationError } = await supabase
      .from('item_reservations')
      .insert(reservationRows);
  
    if (reservationError) {
      throw new BadRequestException(reservationError.message);
    }
  
    return {
      message: 'Booking created successfully',
      data: {
        booking_id,
        reservations: reservationRows as Tables<'item_reservations'>[],
      },
    };
  }

  async createBookingWithItemsViaRpc(payload: {
    user_id: string;
    items: {
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }[];
  }): Promise<{ booking_id: string; status: string }> {
    const supabase = this.supabaseService.getClient();
  
    const { data, error } = await supabase.rpc('create_booking_with_reservations', {
      _user_id: payload.user_id,
      _items: payload.items,
    });
  
    if (error) {
      throw new BadRequestException(error.message); // from @nestjs/common
    }
    return data;
  }


  async createEmptyBooking(user_id: string): Promise<ApiResponse<Tables<'bookings'>>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('bookings')
      .insert({ user_id })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Empty booking created successfully',
      data,
    };
  }

   // New method to review booking availability. Checks all items in the booking to see if they are available.
   async reviewBookingAvailability(bookingId: string): Promise<ApiResponse<{ booking_id: string; status: string; issues: string[] }>> {
    const supabase = this.supabaseService.getClient();

    const { data: reservations, error } = await supabase
      .from('item_reservations')
      .select('id, item_id, start_date, end_date, quantity')
      .eq('booking_id', bookingId);

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!reservations || reservations.length === 0) {
      return { message: 'No reservations found for booking', data: { booking_id: bookingId, status: 'fail', issues: ['No reservations found.'] } };
    }

    const issues: string[] = [];

    for (const r of reservations) {
      const { id, item_id, start_date, end_date, quantity } = r;

      const { data: totalStockData, error: stockErr } = await supabase
        .from('items')
        .select('quantity')
        .eq('item_id', item_id)
        .single();

      if (stockErr || !totalStockData) {
        issues.push(`Reservation ${id}: Item ${item_id}: could not fetch stock info`);
        continue;
      }

      const totalStock = totalStockData.quantity;

      const { data: overlapping, error: overlapErr } = await supabase
        .from('item_reservations')
        .select('quantity')
        .eq('item_id', item_id)
        .lte('start_date', end_date)
        .gte('end_date', start_date);

      if (overlapErr) {
        issues.push(`Reservation ${id}: Item ${item_id}: error checking overlapping reservations`);
        continue;
      }

      const alreadyReserved = overlapping.reduce((sum, row) => sum + row.quantity, 0);
      const available = totalStock - alreadyReserved;

      if (available < quantity) {
        issues.push(`Reservation ${id}: Item ${item_id} only has ${available} left during ${start_date} - ${end_date}`);
      }
    }

    const uniqueIssues = [...new Set(issues)];

    return {
      message: 'Availability review completed',
      data: {
        booking_id: bookingId,
        status: uniqueIssues.length === 0 ? 'ok' : 'fail',
        issues: uniqueIssues,
      },
    };
  }
}
