import { CanActivate, Type } from '@nestjs/common';
export declare function AuthGuard(...requiredRoles: string[]): Type<CanActivate>;
