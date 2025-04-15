import { Injectable } from '@nestjs/common';
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
}
