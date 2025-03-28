import { Controller, Get } from '@nestjs/common';
import { SupabaseRoleService } from '../services/supabase-role.service';

@Controller('test-role')
export class TestRoleController {
  constructor(private readonly supabaseRoleService: SupabaseRoleService) {}

  // Endpoint to test fetching from the public.admins table using the service role
  @Get('admins')
  async testAdmins() {
    try {
      const data = await this.supabaseRoleService.getPublicAdmins();
      return {
        status: 'Successfully fetched public admins!',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in testAdmins:', error);
      return {
        status: 'Failed to fetch public admins',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Endpoint to test fetching from the public.users table using the service role
  @Get('users')
  async testUsers() {
    try {
      const data = await this.supabaseRoleService.getPublicUsers();
      return {
        status: 'Successfully fetched public users!',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in testUsers:', error);
      return {
        status: 'Failed to fetch public users',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}