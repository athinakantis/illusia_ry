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
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../services/supabase.service");
let TestController = class TestController {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async testConnection() {
        try {
            const { data, error } = await this.supabaseService.supabase
                .from('test')
                .select('*')
                .limit(50);
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            return {
                status: 'Connected to Supabase!',
                data,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('Error in testConnection:', error);
            return {
                status: 'Connection failed',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Get)("supabase"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "testConnection", null);
exports.TestController = TestController = __decorate([
    (0, common_1.Controller)('test'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TestController);
//# sourceMappingURL=test.controller.js.map