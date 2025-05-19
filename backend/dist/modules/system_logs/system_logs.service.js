"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let SystemLogsService = class SystemLogsService {
    constructor(supabase) {
        this.supabase = supabase;
        this.DEFAULT_LIMIT = 50;
        this.MAX_LIMIT = 200;
    }
    async findAll(opts = {}) {
        const client = this.supabase.getClient();
        const limit = Math.min(Number(opts.limit) || this.DEFAULT_LIMIT, this.MAX_LIMIT);
        const page = Math.max(Number(opts.page) || 1, 1);
        const fromIdx = (page - 1) * limit;
        const toIdx = fromIdx + limit - 1;
        let query = client
            .from('system_logs')
            .select('*', { count: 'exact' });
        if (opts.actionType) {
            query = query.eq('action_type', opts.actionType.toUpperCase());
        }
        if (opts.from) {
            query = query.gte('created_at', opts.from);
        }
        if (opts.to) {
            query = query.lte('created_at', opts.to);
        }
        if (opts.tableName) {
            query = query.eq('table_name', opts.tableName.toLowerCase());
        }
        if (opts.userId) {
            query = query.eq('user_id', opts.userId);
        }
        if (opts.search) {
            query = query.textSearch('metadata_fts', opts.search, {
                type: 'plain',
                config: 'simple',
            });
        }
        query = query
            .order('created_at', { ascending: false })
            .range(fromIdx, toIdx);
        let data, count;
        try {
            const res = await query;
            data = res.data;
            count = res.count;
            if (res.error)
                throw res.error;
        }
        catch (err) {
            if (err?.message?.includes('Requested range not satisfiable')) {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 0,
                    },
                };
            }
            throw err;
        }
        return {
            data,
            meta: {
                total: count ?? 0,
                page,
                limit,
                totalPages: limit ? Math.ceil((count ?? 0) / limit) : 1,
            },
        };
    }
};
exports.SystemLogsService = SystemLogsService;
exports.SystemLogsService = SystemLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SystemLogsService);
//# sourceMappingURL=system_logs.service.js.map