import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';

@Module({
  imports: [SupabaseModule],
  controllers: [CategoryController],
  providers:    [CategoryService],
  exports:      [],   // only export the service if other modules need it
})
export class CategoriesModule {}