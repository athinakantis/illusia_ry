import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { SupabaseService } from './services/supabase.service';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/items.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ViewsController } from './controllers/views.controller';
import { ViewsService } from './services/view.service';
import { GuestService } from './services/guest.service';
import { GuestController } from './controllers/guest.controller';
import { MailerController } from './controllers/mailer.controller';
import { BookingService } from './services/bookings.service';
import { BookingController } from './controllers/bookings.controller';
import { ItemReservationsController } from './controllers/reservations.controller';
import { ItemReservationService } from './services/reservations.service';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    GuestController,
    ItemController,
    MailerController,
    ViewsController,
    BookingController,
    ItemReservationsController,
    AdminController
    
  ], // Controller imports go here
  providers: [
    AppService,
    SupabaseService,
    ItemService,
    ViewsService,
    GuestService,
    MailerService,
    BookingService,
    ItemReservationService,
    AdminService
  ], // Services are used to handle business logic and data access
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      ItemController,
      ViewsController,
      // MailerController,
      BookingController,
      ItemReservationsController,
      AdminController,);
  }
}