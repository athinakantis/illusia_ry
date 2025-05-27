import { SupabaseModule } from '../supabase/supabae.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ItemReservationsController } from './reservations.controller';
import { ItemReservationService } from './reservations.service';
import { GuestModule } from '../guest/guest.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [SupabaseModule,GuestModule],
  controllers: [ItemReservationsController],
  providers:    [ItemReservationService],
  exports:      [],   // only export the service if other modules need it
})
export class ItemReservationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      // Only apply to some endpoints
      .forRoutes(
        { path: 'reservations/', method: RequestMethod.POST },
        { path: 'reservations/booking/:bookingId', method: RequestMethod.DELETE },
        { path: "reservations/booking/:bookingId/reservationId", method: RequestMethod.PATCH }
      );
  }
}