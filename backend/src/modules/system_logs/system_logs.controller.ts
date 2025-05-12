import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemLogsService } from './system_logs.service';
import { AuthGuard } from 'src/guards/role.guard';

@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly logsService: SystemLogsService) {}

  /**
   * GET /system-logs
   * Query parameters:
   *   • limit        – rows per page (default 50, max 200)
   *   • page         – page number starting at 1
   *   • action_type  – filter by 'INSERT' | 'UPDATE' | 'DELETE'
   *   • from, to     – ISO date strings (e.g. 2025-05-01)
   *
   * Example:
   *   /system-logs?limit=25&page=2&action_type=DELETE
   */
  @UseGuards(AuthGuard('Admin', 'Head Admin'))
  @Get()
  async getLogs(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('action_type') actionType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.logsService.findAll({
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      actionType,
      from,
      to,
    });
  }
}