// In /backend/src/controllers/test.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';
@Controller('test')
export class TestController2 {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('test-getter')
  @UseGuards(AuthGuard('jwt'))
  async testGetter(@Req() req: Request) {
    // Use the getter to retrieve the current Supabase client.
    const client = this.supabaseService.supabase;
   
    
    const { data, error } = await client.from('items').select('*').limit(1);

    if (error) {
      return {
        message: 'Error fetching users',
        error: error.message,
        currentToken: this.supabaseService.getCurrentToken(),
      };
    }

    return {
      message: 'Supabase client is working and getter is functioning correctly!',
      currentToken: this.supabaseService.getCurrentToken(),
      queryData: data,
      user: req.user, // Provided by the JWT guard.
    };
  }
}