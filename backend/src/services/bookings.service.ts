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

    if (error) throw error;

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

    if (error) throw error;

    return {
      message: `Booking ${id} retrieved successfully`,
      data,
    };
  }

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
  
    if (bookingError) throw bookingError;
  
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
  
    if (reservationError) throw reservationError;
  
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
}
