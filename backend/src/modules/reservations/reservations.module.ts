import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { ItemReservationsController } from './reservations.controller';
import { ItemReservationService } from './reservations.service';
import { GuestModule } from '../guest/guest.module';

@Module({
  imports: [SupabaseModule,GuestModule],
  controllers: [ItemReservationsController],
  providers:    [ItemReservationService],
  exports:      [],   // only export the service if other modules need it
})
export class ItemReservationsModule {}