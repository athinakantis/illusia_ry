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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('SUPABASE_URL');
        const key = this.configService.get('SUPABASE_ANON_KEY');
        if (!url || !key) {
            throw new Error('Supabase URL or Key is not defined in the environment variables');
        }
        this._supabase = (0, supabase_js_1.createClient)(url, key);
    }
    get supabase() {
        return this._supabase;
    }
    async getUsers() {
        const { data, error } = await this.supabase.from('users').select('*');
        if (error)
            throw error;
        return data;
    }
    async addUser(user) {
        const { data, error } = await this.supabase.from('users').insert(user);
        if (error)
            throw error;
        return data;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map