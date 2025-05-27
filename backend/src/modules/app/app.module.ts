import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemController } from '../item/item.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ViewsController } from '../views/views.controller';
import { BookingController } from '../bookings/bookings.controller';
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

import { SystemLogsModule } from '../system_logs/system_logs.module';
import { SystemLogsController } from '../system_logs/system_logs.controller';
import { ItemModule } from '../item/item.module';
import { GuestModule } from '../guest/guest.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsController } from '../notifications/notifications.controller';
import { AccountModule } from '../account/account.module';
import { AccountController } from '../account/account.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriesModule,
    TagModule,
    AdminModule,
    BookingModule,
    ViewsModule,
    ItemReservationsModule,
    MailerModule,
    ItemModule,
    SystemLogsModule,    
    GuestModule,
    AccountModule,
    NotificationsModule
    
    // Import other modules here if needed
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      ItemController,
      ViewsController,
      NotificationsController,
      // MailerController,
      BookingController,
      AdminController,
      TagController,
      CategoryController,
      SystemLogsController,
      AccountController
      // Add other controllers that need authentication here
      );
  }
}