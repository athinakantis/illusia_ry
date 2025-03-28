import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// I seperated this service from the SupabaseService because this is using the service role key.
// The SupabaseService is using the anon key.
@Injectable()
export class SupabaseRoleService {
  private readonly _supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceRoleKey) {
      throw new Error('Supabase URL or Service Role Key is not defined in environment variables');
    }
    this._supabase = createClient(url, serviceRoleKey);
  }

  get supabase() {
    return this._supabase;
  }

  // Query the public.admins table
  async getPublicAdmins() {
    const { data, error } = await this._supabase
      .from('admins')
      .select('*');
    if (error) {
      console.error('Error fetching public.admins:', error);
      throw error;
    }
    return data;
  }

  // Query the public.users table
  async getPublicUsers() {
    const { data, error } = await this._supabase
      .from('users')
      .select('*');
    if (error) {
      console.error('Error fetching public.users:', error);
      throw error;
    }
    return data;
  }
}