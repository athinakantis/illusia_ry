import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './items.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ItemController],
  providers:    [ItemService],
  exports:      [],   // only export the service if other modules need it
})
export class ItemModule {}