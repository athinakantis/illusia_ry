import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MailerModule } from '../mailer/mailer.module';


@Module({
  imports: [SupabaseModule,MailerModule],
  controllers: [AdminController],
  providers:    [AdminService,],
  exports:      [],   // only export the service if other modules need it
})
export class AdminModule {}