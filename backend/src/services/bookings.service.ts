import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';
import { SupabaseService } from './supabase.service';
import { CustomRequest } from 'src/types/request.type';


@Injectable()
export class BookingService {
    constructor(private readonly supabaseService: SupabaseService) {}

  async getBookings(req: CustomRequest): Promise<ApiResponse<Tables<'bookings'>[]>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
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

  async getBookingById(req: CustomRequest, id: string): Promise<ApiResponse<Tables<'bookings'>>> {
    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', id)
      .maybeSingle();
      console.log("data", data);
    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!data) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    if (error) {
      throw new BadRequestException(error);
    }

    return {
      message: `Booking ${id} retrieved successfully`,
      data,
    };
  }

  async createBooking(req: CustomRequest, payload: {
    items: {
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }[];
  }): Promise<ApiResponse<{ booking_id: Tables<'bookings'>['booking_id']; reservations: Tables<'item_reservations'>[] }>> {
    const supabase = req['supabase'];
    const userId = req['user']?.id;

    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({ user_id: userId })
      .select()
      .single();
  
    if (bookingError) {
      throw new BadRequestException(bookingError.message);
    }
  
    const booking_id = bookingData.booking_id;
  
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

  async createBookingWithItemsViaRpc(req: CustomRequest, payload: {
    items: {
      item_id: string;
      start_date: string;
      end_date: string;
      quantity: number;
    }[];
  }): Promise<{ booking_id: string; status: string }> {
    const supabase = req['supabase'];
    const userId = req['user']?.id;

    const { data, error } = await supabase.rpc('create_booking_with_reservations', {
      _user_id: userId,
      _items: payload.items,
    });
  
    if (error) {
      throw new BadRequestException(error.message); // from @nestjs/common
    }
    return data;
  }

  async createEmptyBooking(req: CustomRequest): Promise<ApiResponse<Tables<'bookings'>>> {
    const supabase = req['supabase'];
    const userId = req['user']?.id;

    const { data, error } = await supabase
      .from('bookings')
      .insert({ user_id: userId })
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
   async reviewBookingAvailability(req: CustomRequest, bookingId: string): Promise<ApiResponse<{ booking_id: string; status: string; issues: string[] }>> {
    const supabase = req['supabase'];

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

      const alreadyReserved: number = overlapping.reduce<number>(
        (sum: number, row: { quantity: number }) => sum + row.quantity,
        0
      );
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

  /**
   * Update the status field of a booking.
   * - Ordinary users can update only their own booking (enforced by RLS).
   * - Admin / Head‑Admin can update any booking.
   */
  async updateBookingStatus(
    req: CustomRequest,
    bookingId: string,
    status: Tables<'bookings'>['status'],
  ): Promise<ApiResponse<Tables<'bookings'>>> {
    const supabase = req['supabase'];
 
    if (!status) {
      throw new BadRequestException('Status value is required');
    }
 
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', bookingId)
      .select()
      .maybeSingle();
  
    if (!data) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
 
    if (error) {
      throw new BadRequestException(error);
    }
 
    return {
      message: `Booking ${bookingId} status updated to "${status}"`,
      data,
    };
  }
  
  async deleteBooking(req: CustomRequest, bookingId: string): Promise<ApiResponse<Tables<'bookings'>[]>> {
    const supabase = req['supabase'];
 
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_id', bookingId)
      .select();
      
    if (!data) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
    if (!data.length) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
      console.log("error", error);
    if (error) {
      throw new BadRequestException(error);
    }
 
    return {
      message: 'Booking deleted successfully',
      data: data || [],
    };
  }  


}
