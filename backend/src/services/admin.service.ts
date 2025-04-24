// backend/src/services/users.service.ts
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { CustomRequest } from 'src/types/request.type';
  import { Tables } from 'src/types/supabase';
  import { ApiResponse } from 'src/types/response';
  import { AdminUserRow } from 'src/types/admin-user.type';
  @Injectable()
  export class AdminService {
    /**
     * Throws ForbiddenException unless the caller is an admin, determined
     * by the Postgres function `is_user_admin(p_user_id uuid) RETURNS boolean`.
     */
    private async assertAdmin(req: CustomRequest): Promise<void> {
      const supabase = req['supabase'];
      const userId = req['user']?.id;

      const { data: isAdmin, error } = await supabase
        .rpc('is_user_admin', { p_user_id: userId });

      if (error) {
        throw new BadRequestException(error.message);
      }
      if (!isAdmin) {
        throw new ForbiddenException('Admin privileges required');
      }
    }
  
    /**
     * Return **all** rows from public.users.
     * Throws 403 if the caller is not an admin.
     */
    async getAllUsers(
      req: CustomRequest,
    ): Promise<ApiResponse<AdminUserRow[]>> {
      await this.assertAdmin(req);
      
      const supabase = req['supabase'];

      const { data, error } = await supabase
        .from('users')
        .select('user_id, display_name, email, user_status')
        .order('user_id', { ascending: true });
  
      if (error) {
        throw new BadRequestException(error.message);
      }
  
      return {
        message: 'All users retrieved successfully',
        data: data ?? [],
      };
    }
    
    /**
     * Simple endpoint to get a users role
     * @parms req CustomRequest with Supabase Client
     * @param userId UUID of the user
     * @returns role: string
     */
    async getUserRoleById(req: CustomRequest, userId: string): Promise<ApiResponse<{ role: string }>> {
      const supabase = req['supabase'];
     
  
      const { data, error } = await supabase
        .from('user_with_roles_view')
        .select('role_title')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) {
        throw new BadRequestException(error.message);
      }
      if (!data) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      return {
        message: `User ${userId} role retrieved successfully`,
        data: {
          role: data.role_title,
        },
      };
    }

      /**
     * A function to get all users from the user_role_view table
     * @returns {Promise<ApiResponse<AdminUserRow[]>>}
     * @throws {BadRequestException} if there is an error with the request
     */
  async getUsersWithRole(req: CustomRequest): Promise<ApiResponse<AdminUserRow[]>> {

    await this.assertAdmin(req);

    const supabase = req['supabase'];

    const { data, error } = await supabase
      .from('user_with_roles_view')
      .select("*")
      .order('user_id', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'All users retrieved successfully',
      data: data ?? [],
    };
  }
    /**
     * Get a single user from users table by user_id
     * @param req Custom Reqest with Supabase Client
     * @param userId UUID of user
     */
    async getUserById(
      req: CustomRequest,
      userId: string,
    ): Promise<ApiResponse<Tables<'users'>>> {
      await this.assertAdmin(req);
  
      const supabase = req['supabase'];
  
      const { data, error } = await supabase
        .from('users')
        .select('user_id, display_name, email, user_status')
        .eq('user_id', userId)
        .maybeSingle();
  
      if (error) {
        throw new BadRequestException(error.message);
      }
      if (!data) {
        throw new NotFoundException(`User ${userId} not found`);
      }
  
      return {
        message: `User ${userId} retrieved successfully`,
        data 
      };
    }

    /**
     * Change a user's status from "pending" to either "approved" or "rejected".
     * Only callable by admins (enforced via assertAdmin).
     * This column(user_status) does not do anything right now but will be used in the future.
     */
    async updateUserStatus(
      req: CustomRequest,
      userId: string,
      status: 'approved' | 'rejected',
    ): Promise<ApiResponse<Tables<'users'>>> {
      await this.assertAdmin(req);

      if (!['approved', 'rejected'].includes(status)) {
        throw new BadRequestException('Status must be "approved" or "rejected".');
      }

      const supabase = req['supabase'];

      // Make sure the user exists and is currently pending
      const { data: existing, error: fetchErr } = await supabase
        .from('users')
        .select('user_status')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchErr) {
        throw new BadRequestException(fetchErr.message);
      }
      if (!existing) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      if (existing.user_status !== 'pending') {
        throw new BadRequestException(
          `User ${userId} status is already "${existing.user_status}"`,
        );
      }

      // Perform the update
      const { data, error } = await supabase
        .from('users')
        .update({ user_status: status })
        .eq('user_id', userId)
        .select('user_id, display_name, email, user_status')
        .maybeSingle();

      if (error) {
        throw new BadRequestException(error.message);
      }
      if(!data) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      return {
        message: `User ${userId} status updated to "${status}"`,
        data 
      };
    }
  }