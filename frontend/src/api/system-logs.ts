import { ApiResponse } from '../types/types';
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

/** Pagination metadata returned by /system-logs */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Full payload returned by the /system-logs endpoint */
export interface SystemLogsResponse
  extends ApiResponse<SystemLog[], PaginationMeta> {
  meta: PaginationMeta; // overrides the optional with a required one
}

/* ------------------------------------------------------------------
 * API helper
 * -----------------------------------------------------------------*/

/**
 * Fetch system logs with server‑side filtering & pagination.
 * 
 * ![label](https://http.cat/418)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any>{// cant deal with the response typing anymore.... Its just not working 
  const response = await api.get<SystemLogsResponse>('/system-logs', {
    params,
  });
  return response
}

export const systemLogsApi = { fetch };
export default systemLogsApi;