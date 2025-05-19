"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsService = void 0;
const common_1 = require("@nestjs/common");
let ViewsService = class ViewsService {
    async getFrontendItemView(req) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('frontend_item_view')
            .select('*');
        if (error) {
            console.error('Error fetching view data:', error);
            throw error;
        }
        return {
            message: 'Successfully fetched frontend item view',
            data: data || [],
        };
    }
};
exports.ViewsService = ViewsService;
exports.ViewsService = ViewsService = __decorate([
    (0, common_1.Injectable)()
], ViewsService);
//# sourceMappingURL=view.service.js.map