// In /backend/src/services/supabase.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private _supabase: SupabaseClient;
  private currentToken: string | null = null; // For testing purposes

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    if (!url || !key) {
      throw new Error(
        'Supabase URL or Key is not defined in the environment variables',
      );
    }
    this._supabase = createClient(url, key);
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

  

}
  