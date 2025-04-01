import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from 'src/services/supabase.service';
// Testing privleges
@Controller('users')
export class UsersController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    try {
      const users = await this.supabaseService.getUsers();
      return { status: 'success', data: users };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}