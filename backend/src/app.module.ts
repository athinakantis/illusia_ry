import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { SupabaseService } from './services/supabase.service';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/items.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ViewController } from './controllers/views.controller';
import { ViewsService } from './services/view.service';
import { GuestService } from './services/guest.service';
import { GuestController } from './controllers/guest.controller';

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
    ViewController,
  ], // Controller imports go here
  providers: [
    AppService,
    SupabaseService,
    ItemService,
    ViewsService,
    GuestService
  ], // Services are used to handle business logic and data access
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ItemController, ViewController);
  }
}