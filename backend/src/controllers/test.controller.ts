import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';

@Controller('test')
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Protected route to test that the interceptor is setting the token
  @Get('token')
  @UseGuards(AuthGuard('jwt'))
  getToken(@Req() req: Request) {
    // The interceptor takes care of setting the token in the request headers.
    const currentToken = this.supabaseService.getCurrentToken();
   
    return {
      message: 'Token was set via the interceptor',
      token: currentToken,
      user: req.user,
    };
  }

  @Get('supabase')
  @UseGuards(AuthGuard('jwt'))
  async testConnection(@Req() req: Request) {
    // Extract the token from the Authorization header.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { status: 'Access denied: Missing token' };
    }
    const token = authHeader.split(' ')[1];

    // Set the token in the Supabase client using the new method.
    this.supabaseService.setAuthToken(token);

    // Now use the updated client to query the 'test' table.
    const supabaseClient = this.supabaseService.supabase;

    // Now query the 'test' table. With RLS enabled, Supabase will check the token.
    const { data, error } = await supabaseClient
      .from('test')
      .select('*')
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return {
        status: 'Connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
    return {
      status: 'Connected to Supabase!',
      data,
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
