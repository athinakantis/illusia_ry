import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { SupabaseService } from './services/supabase.service';
import { UsersController } from './controllers/users.controller';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/items.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ProtectedDataController } from './controllers/protected-data.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    ProtectedDataController,
    ItemController,
  ], // Controller imports go here
  providers: [AppService, SupabaseService, ItemService], // Services are used to handle business logic and data access
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProtectedDataController,ItemController);
  }
}