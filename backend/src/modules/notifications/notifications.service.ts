import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/role.guard';
import { NotificationsType } from 'src/types/notifications';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';
import { Tables } from 'src/types/supabase';

@Injectable()
export class NotificationsService {
  async getUserNotifications(
    userId: string,
    req: CustomRequest,
  ): Promise<ApiResponse<Tables<'notifications'>[]>> {
    const CLIENT = req['supabase'];

    const { data, error } = await CLIENT.from('notifications')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error;

    return {
      message: `Successfully retrieved user notifications!`,
      data,
    };
  }
  
  @UseGuards(AuthGuard('Admin', 'Head Admin'))
  async getAdminNotifications(
    req: CustomRequest,
  ): Promise<ApiResponse<Tables<'notifications'>[]>> {
    const CLIENT = req['supabase'];
    console.log('received request to admin route')
    const { count, data, error } = await CLIENT.from('notifications')
      .select('*')
      .eq('recipient_type', 'ADMIN');

    if (error) throw error;

    return {
      message: `Successfully retrieved admin notifications!`,
      data,
    };
  }

  async getNotificationsOfType(
    type: NotificationsType,
    req: CustomRequest,
  ): Promise<ApiResponse<Tables<'notifications'>[]>> {
    const CLIENT = req['supabase'];

    const { data, error } = await CLIENT.from('notifications')
      .select('*')
      .eq('type', type);

    if (error) throw error;

    return {
      message: `Successfully retrieved notifications of type ${type}`,
      data,
    };
  }

  async updateNotification(
    id: string,
    req: CustomRequest,
    body: Partial<Tables<'notifications'>>,
  ): Promise<ApiResponse<Tables<'notifications'>>> {
    const CLIENT = req['supabase'];
    const read_at = new Date().toISOString()

    const { data, error } = await CLIENT.from('notifications')
    .update({...body, read_at})
    .eq('id', id)
    .select()
    .maybeSingle()

    if (error || !data) throw error;

    return {
      message: `Successfully retrieved updated notification!`,
      data,
    };
  }
}
