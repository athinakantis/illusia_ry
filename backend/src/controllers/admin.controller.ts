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
import { ApiResponse, UserWithRole } from 'src/types/response';

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
 
  // Update a Users status(Flexible)
  // admin/users/status
  @Patch('users/status')
  async updateUserStatus(
    @Req() req: CustomRequest,
    @Body() body: { status: 'approved' | 'rejected' | 'deactivated' | 'active', userId: string },
  ) {
    if (!body.userId || typeof body.userId !== 'string') {
      throw new BadRequestException('Body must contain a "userId" string property');
    }
    if (!body.status || typeof body.status !== 'string') {
      throw new BadRequestException('Body must contain a "status" string property');
    }
    return this.AdminsService.updateUserStatus(
      req,
      body.userId,
      body.status,
    );
  }

  /**
   * Update a user's role to anything(Only Head-Admin)
   * @param req  CustomRequest with Supabase client
   * @param body { role: string, userId: string }
   * @returns { message: string, data: UserWithRole }
   */
  @Patch('users/role')
  async updateAnyRole(
    @Req() req: CustomRequest,
    @Body() body: { role: string, userId: string },
  ): Promise<ApiResponse<UserWithRole>> {
    if (!body.userId || typeof body.userId !== 'string') {
      throw new BadRequestException('Body must contain a "userId" string property');
    }
    if (!body.role || typeof body.role !== 'string') {
      throw new BadRequestException('Body must contain a "role" string property');
    }
    return this.AdminsService.updateUserRole(req, body.userId, body.role);
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
