import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
  @Patch('users/:id/status')
  async updateUserStatus(
    @Req() req: CustomRequest,
    @Param('id') userId: string,
    @Body() body: { status: 'approved' | 'rejected' | 'deactivated' | 'active' },
  ) {
    return this.AdminsService.updateUserStatus(
      req,
      userId,
      body.status,
    );
  }

  /**
   * Update a user's role
   * @param req  CustomRequest with Supabase client
   * @param userId UUID of the user
   * @param body  { role: string }
   */
  @Patch('users/:id/role')
  async updateUserRole(
    @Req() req: CustomRequest,
    @Param('id') userId: string,
    @Body() body: { role: string },
  ) {
    if (!body.role || typeof body.role !== 'string') {
      throw new BadRequestException('Body must contain a "role" string property');
    }
    return this.AdminsService.updateUserRole(req, userId, body.role);
  }

  /**
 * Promote a User to Admin
 */
@Patch('users/:id/promote-to-admin')
async promoteUserToAdmin(
  @Req() req: CustomRequest,
  @Param('id') userId: string,
) {
  return this.AdminsService.promoteUserToAdmin(req, userId);
}

/**
 * Approve Unapproved user to regular User
 */
@Patch('users/:id/approve')
async approveUserToUser(
  @Req() req: CustomRequest,
  @Param('id') userId: string,
) {
  return this.AdminsService.approveUserToUser(req, userId);
}
}
