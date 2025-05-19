import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { ItemReservationsController } from './reservations.controller';
import { ItemReservationService } from './reservations.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ItemReservationsController],
  providers:    [ItemReservationService],
  exports:      [],   // only export the service if other modules need it
})
export class ItemReservationsModule {}