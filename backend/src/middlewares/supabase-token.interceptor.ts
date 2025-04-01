import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';

// Need to make a better definition for this
interface ProtectedResponse {
  status: string;
  data: unknown;
  user: Request["user"];
  timestamp: string;
}
@Injectable()
export class SupabaseTokenInterceptor implements NestInterceptor {
  constructor(private readonly supabaseService: SupabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ProtectedResponse> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      this.supabaseService.setAuthToken(token);
    }
    return next.handle();
  }
}