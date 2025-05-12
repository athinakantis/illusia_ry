import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Query parameters you can pass from the controller / HTTP layer.
 *  • limit       – how many rows per page (default 50, max 200)
 *  • page        – 1‑based page index (default 1)
 *  • actionType  – filter by TG_OP value: INSERT | UPDATE | DELETE
 *  • from, to    – ISO date strings to bound created_at
 */
export interface LogQueryOptions {
  limit?: number;
  page?: number;
  actionType?: string;
  from?: string;
  to?: string;
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

    // ---------- sort + slice ----------
    query = query
      .order('created_at', { ascending: false })
      .range(fromIdx, toIdx);

    // ---------- execute ----------
    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
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
}