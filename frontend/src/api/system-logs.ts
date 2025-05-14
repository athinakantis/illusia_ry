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

/** Shape returned by the Nest controller */
interface PaginatedResponse {
  data: SystemLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
async function fetch(params: SystemLogQuery = {}): Promise<PaginatedResponse> {
  const { data } = await api.get<PaginatedResponse>(
    '/system-logs',
    { params },
  );
  console.log('system-logs response', data);
  return data;
}

export const systemLogsApi = { fetch };
export default systemLogsApi;