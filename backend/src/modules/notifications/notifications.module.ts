import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [SupabaseModule],
  controllers: [NotificationsController],
  providers:    [NotificationsService],
  exports:      [],   // only export the service if other modules need it
})
export class NotificationsModule {}