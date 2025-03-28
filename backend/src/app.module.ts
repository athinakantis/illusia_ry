import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TestController } from './controllers/test.controller';
import { SupabaseService } from './services/supabase.service';
import { TestRoleController } from './controllers/test-role.controller';
import { SupabaseRoleService } from './services/supabase-role.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  
  controllers: [AppController, TestController,TestRoleController],// Controller imports go here
  providers: [AppService, SupabaseService,SupabaseRoleService],// Services are used to handle business logic and data access
})
export class AppModule {}
