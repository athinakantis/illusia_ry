import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { BookingService } from './bookings.service';
import { BookingController } from './bookings.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [BookingController],
  providers:    [BookingService],
  exports:      [],   // only export the service if other modules need it
})
export class BookingModule {}