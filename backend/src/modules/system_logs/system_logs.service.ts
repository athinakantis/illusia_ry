import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Query parameters you can pass from the controller / HTTP layer.
 *  • limit       – how many rows per page (default 50, max 200)
 *  • page        – 1‑based page index (default 1)
 *  • actionType  – filter by TG_OP value: INSERT | UPDATE | DELETE
 *  • tableName   – filter by table name, e.g. 'bookings'
 *  • userId      – filter by actor user ID
 *  • from, to    – ISO date strings to bound created_at
 *  • search      – full-text search inside metadata JSON
 */
export interface LogQueryOptions {
  limit?: number;
  page?: number;
  actionType?: string;  // INSERT | UPDATE | DELETE
  tableName?: string;   // e.g. 'bookings'
  userId?: string;      // filter by actor
  from?: string;        // ISO date
  to?: string;          // ISO date
  search?: string;      // full‑text search inside metadata JSON
}

@Injectable()
export class SystemLogsService {
  private readonly DEFAULT_LIMIT = 50;
  private readonly MAX_LIMIT = 200;

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(opts: LogQueryOptions = {}) {
    const client = this.supabase.getClient();

    // ---------- pagination ----------
    const limit = Math.min(
      Number(opts.limit) || this.DEFAULT_LIMIT,
      this.MAX_LIMIT,
    );

    const page = Math.max(Number(opts.page) || 1, 1);
    const fromIdx = (page - 1) * limit;
    const toIdx = fromIdx + limit - 1;

    // ---------- base query ----------
    let query = client
      .from('system_logs')
      .select('*', { count: 'exact' });

    /**
     * Filters
     * - actionType is case‑insensitive (converted to upper‑case)
     * - from / to accept ISO strings like '2025-05-01' or full
     *   timestamps like '2025-05-01T12:00:00Z'
     */
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
   // change only the search clause
    if (opts.search) {
    query = query.textSearch('metadata_fts', opts.search, {
        type: 'plain',
        config: 'simple',
    });
    }

    // ---------- sort + slice ----------
    query = query
      .order('created_at', { ascending: false })
      .range(fromIdx, toIdx);

    // ---------- execute ----------
    let data, count;
    try {
      const res = await query;
      data = res.data;
      count = res.count;
      if (res.error) throw res.error;
    } catch (err) {
      // PostgREST returns 416 when the requested range is beyond result-set size.
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
      message: 'success',
      meta: {
        total: count ?? 0,
        page,
        limit,
        totalPages: limit ? Math.ceil((count ?? 0) / limit) : 1,
      },
    };
  }
}