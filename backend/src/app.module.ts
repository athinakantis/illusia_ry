import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './services/supabase.service';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/items.service';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    ItemController,
  ], // Controller imports go here
  providers: [SupabaseService, ItemService], // Services are used to handle business logic and data access
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ItemController);
  }
}