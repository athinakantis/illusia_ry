import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ItemService {
  private readonly _supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const anonKey = this.configService.get<string>(
      'SUPABASE_ANON_KEY',
    );
    if (!url || !anonKey) {
      throw new Error(
        'Supabase URL or Anon key is not defined in environment variables',
      );
    }
    this._supabase = createClient(url, anonKey);
  }

  get supabase() {
    return this._supabase;
  }

  async getItems() {
    const { data, error } = await this._supabase.from('items').select('*');
    if (error) {
      console.error('Error fetching items: ', error)
      throw error;
    }
    return data
  }
}
