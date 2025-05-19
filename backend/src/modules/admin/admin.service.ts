import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { CustomRequest } from 'src/types/request.type';
  import { Tables } from 'src/types/supabase';
  import { ApiResponse, UserWithRole } from 'src/types/response';
  import { AdminUserRow } from 'src/types/admin-user.type';
  import { SupabaseService } from 'src/modules/supabase/supabase.service';
import { MailerService } from '../mailer/mailer.service';
import { SupabaseClient } from '@supabase/supabase-js';

  @Injectable()
  export class AdminService {
    constructor(
      private readonly supabaseService: SupabaseService,
      private readonly transporter: MailerService) {
      this.supabaseService = supabaseService;
      this.transporter = transporter;
      }

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
 * by the Postgres function `is_user_strict_admin(p_user_id uuid) RETURNS boolean`.
 * This function is used to check if the user has strict admin privileges.
 * @throws BadRequestException if there is an error with the request
 * @throws ForbiddenException unless the caller is a strict admin, determined
 * @param req CustomRequest middleware
 */
    private async assertStrictAdmin(req: CustomRequest): Promise<void> {
      const supabase = req['supabase'];
      const userId = req['user']?.id;

      const { data: isStrictAdmin, error } = await supabase
        .rpc('is_user_strict_admin', { p_user_id: userId });

      if (error) {
        throw new BadRequestException(error.message);
      }
      if (!isStrictAdmin) {
        throw new ForbiddenException('Strict Admin privileges required');
      }
    }
    /**
     * This function is used to check if the user has head admin privileges.
     * @param req CustomRequest middleware
     * @throws BadRequestException if there is an error with the request
     * @throws ForbiddenException unless the caller is a head admin, determined
     * by the Postgres function `is_user_head_admin(p_user_id uuid) RETURNS boolean`.
     */
    private async assertHeadAdmin(req: CustomRequest): Promise<void> {
      const supabase = req['supabase'];
      const userId = req['user']?.id;

      const { data: isHeadAdmin, error } = await supabase
        .rpc('is_user_head_admin', { p_user_id: userId });

      if (error) {
        throw new BadRequestException(error.message);
      }
      if (!isHeadAdmin) {
        throw new ForbiddenException('Head Admin privileges required');
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
     * @returns {Promise<ApiResponse<UserWithRole[]>>}
     * @throws {BadRequestException} if there is an error with the request
     */
  async getUsersWithRole(req: CustomRequest): Promise<ApiResponse<UserWithRole[]>> {

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
     * Promote a User to Admin.
     * Only Head Admins can do this.
     */
    async promoteUserToAdmin(req: CustomRequest, userId: string): Promise<ApiResponse<UserWithRole>> {
      await this.assertHeadAdmin(req);

      const supabase = req['supabase'];

      // First, get the Admin role_id dynamically
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_title', 'Admin')
        .maybeSingle();

      if (roleError) {
        throw new BadRequestException(roleError.message);
      }
      if (!role) {
        throw new NotFoundException('Admin role not found');
      }

      // Update rather than insert into table
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role_id: role.id })
        .eq('user_id', userId);

      if (updateError) {
        throw new BadRequestException(updateError.message);
      }

     
      const { data: updatedUser, error: fetchError } = await supabase
        .from('user_with_roles_view')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

        
      if (fetchError) {
        throw new BadRequestException(fetchError.message);
      }
      if (!updatedUser) {
        throw new NotFoundException(`User ${userId} not found`);
      }

      return {
        message: `User ${userId} promoted to Admin successfully`,
        data: updatedUser ?? []
      };
    }

    /**
     * Approve an Unapproved user to a regular User role.
     * Admins or Head Admins can do this.
     */
    async approveUserToUser(req: CustomRequest, userId: string)
    : Promise<ApiResponse<UserWithRole>> {
      await this.assertAdmin(req);

      const supabase = req['supabase'];

      // First, get the User role_id dynamically
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_title', 'User')
        .maybeSingle();

      if (roleError) {
        throw new BadRequestException(roleError.message);
      }
      if (!role) {
        throw new NotFoundException('User role not found');
      }

      // Update the user_roles table to set the role_id to User
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role_id: role.id })
        .eq('user_id', userId);


      if (updateError) {
        throw new BadRequestException(updateError.message);
      }


      // Fetch the updated user data to return(This will help with the redux store update)
      const { data: updatedUser, error: fetchError } = await supabase
        .from('user_with_roles_view')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        throw new BadRequestException(fetchError.message);
      }
      if (!updatedUser) {
        throw new NotFoundException(`User ${userId} not found`);
      }


      return {
        message: `User ${userId} approved to regular User role`,
        data: updatedUser ?? []
      };
    }
    
  
  /**
   * Helper: return a role id for a given role title.
   */
  private async getRoleId(
    supabase: SupabaseClient,
    title: string,
  ): Promise<string> {
    const { data, error } = await supabase
      .from('roles')
      .select('id')
      .eq('role_title', title)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!data) {
      throw new NotFoundException(`${title} role not found`);
    }
    return data.id;
  }

  /**
   * Update user's roles to the supplied role.
   * Can be done by Admin/Head Admin. Controller will check.
   * @param req CustomRequest with Supabase client
   * @param userId UUID of the user
   * @param roleTitle Title of the new role
   * @returns { message:string, data: UserWithRole }
   */
  async updateUserRole(
    req: CustomRequest,
    userId: string,
    roleTitle: string,
  ): Promise<ApiResponse<UserWithRole>> {
    // This is a quick fix but we should probably change the calls to use other functions for upgrading roles
    await this.assertAdmin(req);

    const supabase = req['supabase'];

    // Get the role_id for the new role and check if it exists.
       const roleId = await this.getRoleId(supabase, roleTitle);

    
    // Update the existing user_roles row to point to the new role_id.
    const { data: updatedRows, error: updateErr } =
      await supabase
        .from('user_roles')
        .update({ role_id: roleId })
        .eq('user_id', userId)
        .select('user_id'); // returning so we know how many were affected

    if (updateErr) {
      throw new BadRequestException(updateErr.message);
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new NotFoundException(`Role mapping for user ${userId} not found`);
    }


    // Return the updated user with role
    const { data: updatedUser, error: fetchErr } = await supabase
      .from('user_with_roles_view')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      console.log(`Updated user: ${JSON.stringify(updatedUser)}`);

    if (fetchErr) {
      throw new BadRequestException(fetchErr.message);
    }
    if (!updatedUser) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return {
      message: `User ${userId} role updated to "${roleTitle}"`,
      data: updatedUser,
    };
  }

  /**
   * Update a user's status (approved, rejected, deactivated, active),
   * send the appropriate notification email, and log the action.
   */
  async updateUserStatus(
    req: CustomRequest,
    userId: string,
    status: 'approved' | 'rejected' | 'deactivated' | 'active',
  ): Promise<ApiResponse<Tables<'users'>>> {
   
    await this.assertAdmin(req);

    const allowed = ['approved', 'rejected', 'deactivated', 'active'];
    if (!allowed.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const supabase = req['supabase'];

    const { data: updatedUser, error: updateErr } = await supabase
      .from('users')
      .update({ user_status: status })
      .eq('user_id', userId)
      .select('user_id, display_name, email, user_status')
      .maybeSingle();

    if (updateErr) {
      throw new BadRequestException(updateErr.message);
    }
    if (!updatedUser) {
      throw new NotFoundException(`User ${userId} not found`);
    }


    // Notify the user
    // Broken right now and needs to be fixed. The credentials expired and we need new ones.
    // try {
    //   if (status === 'approved') {
    //     await this.transporter.approveAccountEmail(updatedUser.email, updatedUser.display_name);
    //   } else if (status === 'rejected') {
    //     await this.transporter.sendEmail(
    //       updatedUser.email,
    //       'Account Rejected',
    //       `Hello ${updatedUser.display_name}, your account has been rejected.`,
    //     );
    //   } else if (status === 'deactivated') {
    //     await this.transporter.sendAccountDeactivatedEmail(updatedUser.email);
    //   } else if (status === 'active') {
    //     await this.transporter.sendEmail(
    //       updatedUser.email,
    //       'Account Reactivated',
    //       `Hello ${updatedUser.display_name}, your account has been reactivated.`,
    //     );
    //   }
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   throw new BadRequestException('Error sending email');
    // }
   

    return {
      message: `User ${userId} status updated to "${status}"`,
      data: updatedUser,
    };
  }
}
