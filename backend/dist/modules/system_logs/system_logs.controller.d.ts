import { SystemLogsService } from './system_logs.service';
export declare class SystemLogsController {
    private readonly logsService;
    constructor(logsService: SystemLogsService);
    private readonly allowedTableNames;
    getLogs(limit?: string, page?: string, actionType?: string, tableName?: string, userId?: string, search?: string, from?: string, to?: string): Promise<{
        data: any[] | null;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    } | {
        message: string;
        error: string;
        data: never[];
    }>;
}
