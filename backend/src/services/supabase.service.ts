import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly _supabase: SupabaseClient;
 
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    

    if (!url || !key ) {
      throw new Error('Supabase URL and key must be provided');
    }
    // Create a client with the anonymous key for public operations
    this._supabase = createClient(url, key);

    // Create a second client with the service role key for admin operations
   
  }

  get supabase() {
    return this._supabase;
  }



  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) throw error;
    return data;
  }

  async addUser(user: { name: string; email: string }) {
    const { data, error } = await this.supabase.from('users').insert(user);
    if (error) throw error;
    return data;
  }
  async getItems() {
    const { data, error } = await this.supabase.from('items').select('*');
    if (error) throw error;
    return data;
  }
  async getProtectedData(userId: string) {
    console.log(
      `[${new Date().toISOString()}] Fetching protected data for user: ${userId}`,
    );

    const { data, error } = await this.supabase
      .from('items')
      .select('*')

    if (error) {
      console.error(
        `[${new Date().toISOString()}] Error fetching data:`,
        error.message,
      );
      throw error;
    }

    console.log(
      `[${new Date().toISOString()}] Successfully retrieved ${data.length} records for user: ${userId}`,
    );
    return data;
  }
}

  
