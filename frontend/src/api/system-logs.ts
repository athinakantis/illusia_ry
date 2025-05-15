import { api } from './axios';

/* ------------------------------------------------------------------
 * Front‑end “DTO” equivalents
 * -----------------------------------------------------------------*/

/** Mirrors the columns our backend returns from /system-logs */
export interface SystemLog {
  log_id: string;
  user_id: string | null;
  action_type: 'INSERT' | 'UPDATE' | 'DELETE';
  target_id: string | null;
  table_name: string;
  metadata: Record<string, unknown> | null;
  created_at: string; // ISO date‑time
}

export interface SystemLogQuery {
  limit?: number;
  page?: number;
  action_type?: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name?: string;
  user_id?: string;
  search?: string;
  from?: string; // ISO date
  to?: string;   // ISO date
}


/** Full shape returned by the /system-logs endpoint */
export interface SystemLogsResponse {
  data: SystemLog[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
 interface LogsResponse<T> {
  /** Actual payload returned by our backend */
  data: T;
  /** Optional human‑readable note supplied by the server */
  message?: string;
  /** Optional pagination/extra info (shape differs per endpoint) */
  meta?: Record<string, unknown>;
}

/* ------------------------------------------------------------------
 * API helper
 * -----------------------------------------------------------------*/

/**
 * Fetch system logs with server‑side filtering & pagination.
 *
 * @example
 *   const res = await systemLogsApi.fetch({
 *     table_name: 'bookings',
 *     action_type: 'DELETE',
 *     limit: 25,
 *     page: 2,
 *   });
 */
async function fetch(
  params: SystemLogQuery = {},
): Promise<LogsResponse<SystemLogsResponse>> {
  const response = await api.get<SystemLogsResponse>(
    '/system-logs',
    { params },
  );
  console.log('system-logs response', response);
  return response;
}

export const systemLogsApi = { fetch };
export default systemLogsApi;