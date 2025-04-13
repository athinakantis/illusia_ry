import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/types/supabase'

@Injectable()
export class SupabaseService {
  private readonly _supabase: SupabaseClient;
 
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    

    if (!url || !key ) {
      throw new Error('Supabase URL and key must be provided');
    }
    // Create a client with the anonymous key for public operations
    this._supabase = createClient<Database>(url, key);// Added the Database type

  }

  get supabase() {
    return this._supabase;
  }

  async logAction<T>(log: {
    user_id: string;
    action_type: string;
    target_id?: string;
    metadata?: Record<string, T>;
  }) {
    const { error } = await this._supabase
      .from('system_logs')
      .insert({
        ...log,
      });
  
    if (error) {
      console.error('Failed to log system action:', error);
    }
  }
}

