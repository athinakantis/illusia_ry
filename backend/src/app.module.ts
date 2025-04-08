import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { SupabaseService } from './services/supabase.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
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
    UserController,
    AdminController,
  ], // Controller imports go here
  providers: [
    AppService,
    SupabaseService,
    UserService,
    AdminService,
    GuestService
  ], // Services are used to handle business logic and data access
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController, AdminController);
  }
}