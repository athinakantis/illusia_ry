import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TestController } from './controllers/test.controller';
import { SupabaseService } from './services/supabase.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true 
  }),
  PassportModule
],
  controllers: [AppController, TestController], // Controller imports go here
  providers: [AppService, SupabaseService, JwtStrategy], // Services are used to handle business logic and data access
})
export class AppModule {}
