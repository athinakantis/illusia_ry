import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TestController } from './controllers/test.controller';
import { SupabaseService } from './services/supabase.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as Joi from 'joi'; // https://docs.nestjs.com/techniques/configuration#schema-validation
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    // Validate that all necessary env variables are present.
    validationSchema: Joi.object({
      PORT: Joi.number().default(3001),
      SUPABASE_URL: Joi.string().required(),
      SUPABASE_ANON_KEY: Joi.string().required(),
      SUPABASE_JWT_SECRET: Joi.string().required(),
      // Add any other required variables.
    }),
  }),
  PassportModule,
  // ...other modules (like AuthModule, UsersModule, etc.)
],
  controllers: [AppController, TestController,UsersController], // Controller imports go here
  providers: [AppService, SupabaseService, JwtStrategy], // Services are used to handle business logic and data access
})
export class AppModule {}
