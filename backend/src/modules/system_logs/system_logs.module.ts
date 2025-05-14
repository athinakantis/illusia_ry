import { Module } from '@nestjs/common';
import { SystemLogsController } from './system_logs.controller';
import { SystemLogsService } from './system_logs.controller';
import { SupabaseModule } from '../supabase/supabae.module';

@Module({
  imports: [SupabaseModule],
  controllers: [SystemLogsController],
  providers:    [SystemLogsService],
  exports:      [],   // only export the service if other modules need it
})
export class SystemLogsModule {}