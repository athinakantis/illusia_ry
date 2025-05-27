import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [SupabaseModule],
  controllers: [GuestController],
  providers:    [GuestService],
  exports:      [GuestService],   // only export the service if other modules need it
})
export class GuestModule {}