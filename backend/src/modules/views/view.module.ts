import { SupabaseModule } from '../supabase/supabae.module';
import { Module } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './view.service';


@Module({
  imports: [SupabaseModule],
  controllers: [ViewsController],
  providers:    [ViewsService],
  exports:      [],   // only export the service if other modules need it
})
export class ViewsModule {}