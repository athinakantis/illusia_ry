import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { NotificationsType } from 'src/types/notifications';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Req() req: CustomRequest,
  ) {
    console.log('Received request for user notifications of user :', userId)
    return this.notificationsService.getUserNotifications(userId, req);
  }

  @Get('recipient_type/admin')
  async getAdminNotifications(
    @Req() req: CustomRequest,
  ) {
    return this.notificationsService.getAdminNotifications(req);
  }

  @Get('notification_type/:type')
  async getNotificationsOfType(
    @Param('type') type: NotificationsType,
    @Req() req: CustomRequest
  ) {
    return this.notificationsService.getNotificationsOfType(type, req)
  }

  @Patch('/notification/:id')
  async updateNotification(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() body: Partial<Tables<'notifications'>>
  ) {
    return this.notificationsService.updateNotification(id, req, body)
  }
}
