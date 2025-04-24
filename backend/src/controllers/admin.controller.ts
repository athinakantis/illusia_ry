import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from 'src/services/admin.service';
import { CustomRequest } from 'src/types/request.type';

@Controller('admin')
export class AdminController {
  constructor(private readonly AdminsService: AdminService) {}
  /**
   * Get all users data
   * @param req Custom Reqest with Supabase Client
   * @returns { message:string, data: AdminUserRow[] }
   */ // GET /admin/users → all users
  @Get('users')
  async getAllUsers(@Req() req: CustomRequest) {
    return this.AdminsService.getAllUsers(req);
  }
  /**
   * Get All users with their roles
   * @param req Custom Reqest with Supabase Client
   *
   */
  @Get('users/role')
  async getUsersWithRoles(@Req() req: CustomRequest) {
    return this.AdminsService.getUsersWithRole(req);
  }
  /**
   * Get users data by user_id
   * @param req Custom Reqest with Supabase Client
   * @param userId UUID of user
   * @returns { message:string, data: AdminUserRow }
   */ // GET /admin/users/:id → get one user by user_id
  @Get('user/:id')
  async getUserById(@Req() req: CustomRequest, @Param('id') userId: string) {
    return this.AdminsService.getUserById(req, userId);
  }
  /**
   * Get users data by user_id with their role
   * @param req Custom Reqest with Supabase Client
   * @param userId UUID of user
   * @returns { message:string, data: AdminUserRow }
   */ // GET /admin/users/:id/role → get one user by user_id
  @Get('user/:id/role')
  async getUserRole(@Req() req: CustomRequest, @Param('id') userId: string) {
    return this.AdminsService.getUserRoleById(req, userId);
  }
  /**
   * Update user status
   * @param req Custom Reqest with Supabase Client
   * @param userId UUID of user
   * @param body { status: string }
   * @returns { message:string, data: AdminUserRow }
   */ // POST /admin/users/:id/status
  @Post('users/:id/status')
  async updateUserStatus(
    @Req() req: CustomRequest,
    @Param('id') userId: string,
    @Body() body: { status: string },
  ) {
    if (body.status !== 'approved' && body.status !== 'rejected') {
      throw new BadRequestException('Status must be "approved" or "rejected".');
    }
    return this.AdminsService.updateUserStatus(
      req,
      userId,
      body.status as 'approved' | 'rejected',
    );
  }
}
