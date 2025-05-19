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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthMiddleware = class AuthMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    async use(req, res, next) {
        console.log(`[${new Date().toISOString()}] Authenticating request to: ${req.method} ${req.path}`);
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.log(`[${new Date().toISOString()}] Authentication failed: Missing or invalid token`);
                throw new common_1.UnauthorizedException('Missing or invalid authorization token');
            }
            const token = authHeader.split(' ')[1];
            const supabaseUrl = this.configService.get('SUPABASE_URL');
            const supabaseAnonKey = this.configService.get('SUPABASE_ANON_KEY');
            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Supabase URL or Anon key not found in environment variables');
            }
            const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            const { data: { user }, error, } = await supabase.auth.getUser(token);
            if (error || !user) {
                console.log(`[${new Date().toISOString()}] Authentication failed: Invalid or expired token`);
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
            console.log(`[${new Date().toISOString()}] Authentication successful for user ID: ${user.id} Email: ${user.email}`);
            req['user'] = user;
            req['supabase'] = supabase;
            next();
        }
        catch (error) {
            console.error(`[${new Date().toISOString()}] Authentication error:`, error.message);
            throw new common_1.UnauthorizedException('Unauthorized: ' + error.message);
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map