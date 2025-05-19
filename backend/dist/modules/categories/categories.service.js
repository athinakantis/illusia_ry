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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let CategoryService = class CategoryService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(dto, req) {
        const supabase = req["supabase"];
        const { data, error } = await supabase
            .from('categories')
            .insert({
            category_name: dto.category_name,
            description: dto.description,
            image_path: dto.image_path,
        })
            .select('*')
            .maybeSingle();
        console.log('error', error);
        if (error?.code === '42501') {
            throw new common_1.BadRequestException('You do not have permission to create a category');
        }
        if (error?.code === '23514') {
            throw new common_1.BadRequestException('Category name must be at least 3 characters long');
        }
        if (error?.code === '23505') {
            throw new common_1.BadRequestException(`Category "${dto.category_name}" already exists`);
        }
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data)
            throw new common_1.BadRequestException('Failed to create category');
        return { message: 'Category created', data };
    }
    async update(req, category_id, dto) {
        const supabase = req["supabase"];
        const { data, error } = await supabase
            .from('categories')
            .update({
            category_name: dto.category_name,
            description: dto.description,
            image_path: dto.image_path,
        })
            .eq('category_id', category_id)
            .select('*')
            .maybeSingle();
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data)
            throw new common_1.NotFoundException('Category not found');
        return { message: 'Category updated', data };
    }
    async remove(req, category_id) {
        const supabase = req["supabase"];
        const { error, count } = await supabase
            .from('categories')
            .delete({ count: 'exact' })
            .eq('category_id', category_id);
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!count)
            throw new common_1.NotFoundException('Category not found');
        return { message: 'Category deleted', data: null };
    }
    async assignItemToCategory(req, item_id, category_id) {
        const supabase = req["supabase"];
        const { data, error } = await supabase
            .from('items')
            .update({ category_id })
            .eq('item_id', item_id)
            .select('*')
            .maybeSingle();
        if (error?.code === '23503') {
            throw new common_1.BadRequestException('Category does not exist');
        }
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data)
            throw new common_1.NotFoundException('Item not found');
        return { message: 'Item assigned to category', data };
    }
    async replaceCategoryWithUncategorized(req, item_id) {
        const supabase = req["supabase"];
        const uncategorized = "c5995b26-a630-46ca-84f0-aad9c02a3553";
        const { data, error } = await supabase
            .from('items')
            .update({ category_id: uncategorized })
            .eq('item_id', item_id)
            .select('*')
            .maybeSingle();
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data)
            throw new common_1.NotFoundException('Item not found');
        return { message: `Category replaced with uncategorized for item ${item_id}`, data };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CategoryService);
//# sourceMappingURL=categories.service.js.map