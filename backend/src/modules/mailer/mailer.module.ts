import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [SupabaseModule],
  controllers: [MailerController],
  providers:    [MailerService],
  exports:      [MailerService],   // only export the service if other modules need it
})
export class MailerModule {}