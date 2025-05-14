import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemLogsService } from './system_logs.service';
import { AuthGuard } from 'src/guards/role.guard';

@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly logsService: SystemLogsService) {}
private readonly allowedTableNames: string[] = [
    'users',
    "roles",
    "user_roles",
    "tags",
    "item_tags",
    "categories",
    'items',
    'bookings',
    'item_reservations',
    'system_logs',
];
  /**
   * GET /system-logs
   * Query parameters:
   *   • @param limit – rows per page (default 50, max 200)
   *   • @param page  – page number starting at 1
   *   • @param action_type  – 'INSERT' | 'UPDATE' | 'DELETE'
   *   • @param table_name   – table name that was modified, e.g. 'bookings'
   *   • @param user_id      – actor's UUID
   *   • @param search       – full‑text search inside metadata JSON
   *   • @param from         – ISO dates to bound created_at
   *   • @param to           – ISO dates to bound created_at
   *
   * @example /system-logs?table_name=bookings&action_type=DELETE&limit=25&page=2
   * 
   */
  @UseGuards(AuthGuard('Admin', 'Head Admin'))
  @Get()
  async getLogs(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('action_type') actionType?: string,
    @Query('table_name') tableName?: string,
    @Query('user_id') userId?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    if (tableName && !this.allowedTableNames.includes(tableName)) {
      return {
        message: 'Invalid table name',
        error: 'Invalid table name',
        data: [],
      };
      };
    return this.logsService.findAll({
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      actionType,
      tableName,
      userId,
      search,
      from,
      to,
    });
  }
}