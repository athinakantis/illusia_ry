import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';

@Controller('test') // URL http://localhost:5001/test
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Combined endpoint to test that the interceptor is setting the token
  // and to query the 'test' table.
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async testEndpoint(@Req() req: Request) {
    // The interceptor should have set the token on the Supabase client,
    // so we can retrieve it here for debugging purposes.
    const currentToken = this.supabaseService.getCurrentToken();

    // Query the 'test' table.
    const { data, error } = await this.supabaseService.supabase
      .from('test')
      .select('*')
      .limit(50);

    if (error) {
      return {
        status: 'Connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'Connected to Supabase!',
      token: currentToken,
      data,
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}