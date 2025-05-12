import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemController } from '../item/item.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ViewsController } from '../views/views.controller';
import { BookingController } from '../bookings/bookings.controller';
import { ItemReservationsController } from '../reservations/reservations.controller';
import { AdminController } from '../admin/admin.controller';
import { TagController } from '../tags/tags.controller';
import { CategoriesModule } from '../categories/categories.module';
import { TagModule } from '../tags/tags.module';
import { CategoryController } from '../categories/categories.controller';
import { AdminModule } from '../admin/admin.module';
import { BookingModule } from '../bookings/bookings.module';
import { ViewsModule } from '../views/view.module';
import { ItemReservationsModule } from '../reservations/reservations.module';
import { MailerModule } from '../mailer/mailer.module';
import { ItemModule } from '../item/item.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Import other modules here if needed
    CategoriesModule,
    TagModule,
    AdminModule,
    BookingModule,
    ViewsModule,
    ItemReservationsModule,
    MailerModule,
    ItemModule,
   
  ],
  controllers: [
    AppController,

    
  ], // Controller imports go here
  providers: [
    AppService,

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
      AdminController,
      TagController,
      CategoryController
      );
  }
}