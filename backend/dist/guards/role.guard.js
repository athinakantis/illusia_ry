"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = AuthGuard;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
function AuthGuard(...requiredRoles) {
    let RoleGuard = class RoleGuard {
        async canActivate(context) {
            const req = context.switchToHttp().getRequest();
            const auth = req.headers['authorization'];
            if (!auth || !auth.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing auth token');
            }
            const token = auth.slice(7);
            let payload;
            try {
                if (!process.env.SUPABASE_JWT_SECRET) {
                    throw new Error('JWT secret is not defined');
                }
                payload = (0, jsonwebtoken_1.verify)(token, process.env.SUPABASE_JWT_SECRET);
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Token verification error:', err.message);
                }
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const userRole = payload.app_metadata?.role;
            if (!userRole || !requiredRoles.includes(userRole)) {
                throw new common_1.ForbiddenException(`Requires role: ${requiredRoles.join(' or ')}, but user has role ${userRole}`);
            }
            req.user = payload;
            return true;
        }
    };
    RoleGuard = __decorate([
        (0, common_1.Injectable)()
    ], RoleGuard);
    return (0, common_1.mixin)(RoleGuard);
}
//# sourceMappingURL=role.guard.js.map