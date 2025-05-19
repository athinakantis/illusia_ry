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
exports.GuestService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
let GuestService = class GuestService {
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('SUPABASE_URL');
        const key = this.configService.get('SUPABASE_ANON_KEY');
        if (!url || !key) {
            throw new Error('Supabase URL and key must be provided');
        }
        this._supabase = (0, supabase_js_1.createClient)(url, key);
    }
    async getPublicItems() {
        try {
            const { data, error } = await this._supabase
                .from('items')
                .select('*')
                .eq("visible", true);
            if (error) {
                console.error('Error retrieving items: ', error);
                throw error;
            }
            return {
                message: 'Items retrieved successfully',
                data: data || [],
            };
        }
        catch (err) {
            console.error('Unexpected error in getPublicItems:', err);
            throw err;
        }
    }
    async getItemById(itemId) {
        try {
            const { data, error } = await this._supabase
                .from('items')
                .select('*')
                .eq('item_id', itemId)
                .single();
            if (error) {
                console.error('Error retrieving item: ', error);
                throw error;
            }
            return {
                message: `Item ${itemId} retrieved successfully`,
                data: data || null,
            };
        }
        catch (err) {
            console.error('Unexpected error in getItemById:', err);
            throw err;
        }
    }
    async getCategories() {
        try {
            const { data, error } = await this._supabase
                .from('categories')
                .select('category_id, category_name, image_path');
            if (error) {
                console.error('Error retrieving item: ', error);
                throw error;
            }
            return {
                message: `Categories retrieved successfully`,
                data: data || null,
            };
        }
        catch (err) {
            console.error('Unexpected error in getItemById:', err);
            throw err;
        }
    }
    async getItemsByCategories(categories) {
        try {
            const { data, error } = await this._supabase
                .from('items')
                .select('*, categories!inner(category_name)')
                .in('categories.category_name', categories);
            console.log(data);
            if (error) {
                console.error('Error retrieving item: ', error);
                throw error;
            }
            return {
                message: `Categories retrieved successfully`,
                data: data || null,
            };
        }
        catch (err) {
            console.error('Unexpected error in getItemById:', err);
            throw err;
        }
    }
    async getItemsAdmin() {
        try {
            const { data, error } = await this._supabase
                .from('items')
                .select('*');
            if (error)
                throw error;
            return { message: 'All items retrieved', data: data || [] };
        }
        catch (err) {
            console.error('Error in getItemsAdmin:', err);
            throw err;
        }
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GuestService);
//# sourceMappingURL=guest.service.js.map