import { Injectable } from '@nestjs/common';
import { Database, Tables } from 'src/types/supabase';
// import { CustomRequest } from 'src/types/request.type'; 
import { ApiResponse } from 'src/types/response';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingService {
private readonly _supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error('Supabase URL and key must be provided');
    }
    // Create a client with the anonymous key for public operations
    this._supabase = createClient<Database>(url, key); // Added the Database type

  }

  async getBookings(/* req: CustomRequest */): Promise<ApiResponse<Tables<'bookings'>[]>> {
    // const supabase = req['supabase'];
    try {
      const { data, error } = await this._supabase
        .from('bookings')
        .select('*');

      if (error) {
        console.error('Error retrieving bookings: ', error);
        throw error;
      }

      return {
        message: 'Bookings retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getBookings:', err);
      throw err;
    }
  }
  async getBookingById(/* req: CustomRequest, */ bookingId: string): Promise<ApiResponse<Tables<'bookings'>>> {
    // const supabase = req['supabase'];
    try {
      const { data, error } = await this._supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (error) {
        console.error('Error retrieving booking: ', error);
        throw error;
      }

      return {
        message: `Booking ${bookingId} retrieved successfully`,
        data: data || null,
      };
    } catch (err) {
      console.error('Unexpected error in getBookingById:', err);
      throw err;
    }
  }
  async getBookingsByUserId(/* req: CustomRequest, */ userId: string): Promise<ApiResponse<Tables<'bookings'>[]>> {
    /* const supabase = req['supabase']; */
    try {
      const { data, error } = await this._supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error retrieving bookings: ', error);
        throw error;
      }

      return {
        message: 'Bookings retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getBookingsByUserId:', err);
      throw err;
    }
  }
  async getBookingsByItemId(/* req: CustomRequest, */ itemId: string): Promise<ApiResponse<Tables<'bookings'>[]>> {
    /* const supabase = req['supabase']; */
    try {
      const { data, error } = await this._supabase
        .from('bookings')
        .select('*')
        .eq('item_id', itemId);

      if (error) {
        console.error('Error retrieving bookings: ', error);
        throw error;
      }

      return {
        message: 'Bookings retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getBookingsByItemId:', err);
      throw err;
    }
  }
  async getBookingsByDate(/* req: CustomRequest, */ date: string): Promise<ApiResponse<Tables<'bookings'>[]>> {
    /* const supabase = req['supabase']; */
    try {
      const { data, error } = await this._supabase
      .from('bookings')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date);


      if (error) {
        console.error('Error retrieving bookings: ', error);
        throw error;
      }

      return {
        message: 'Bookings retrieved successfully',
        data: data || [],
      };
    } catch (err) {
      console.error('Unexpected error in getBookingsByDate:', err);
      throw err;
    }
  }
}
