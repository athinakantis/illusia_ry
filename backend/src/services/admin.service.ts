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
    ): Promise<ApiResponse<Tables<'users'>[]>> {
      await this.assertAdmin(req);
  
      const supabase = req['supabase'];
  
      const { data, error } = await supabase
        .from('users')
        .select('user_id, display_name, email, created_at')
        .order('created_at', { ascending: true });
  
      if (error) {
        throw new BadRequestException(error.message);
      }
  
      return {
        message: 'All users retrieved successfully',
        data: data ?? [],
      };
    }
  
    /**
     * Get a single user by primary key.
     */
    async getUserById(
      req: CustomRequest,
      userId: string,
    ): Promise<ApiResponse<Tables<'users'>>> {
      await this.assertAdmin(req);
  
      const supabase = req['supabase'];
  
      const { data, error } = await supabase
        .from('users')
        .select('user_id, display_name, email, created_at')
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
        data,
      };
    }
  }