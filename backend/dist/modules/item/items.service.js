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
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ItemService = class ItemService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async addItem(req, item) {
        const supabase = req['supabase'];
        const { item_name, description, image_path, location, quantity, category_id, visible, } = item;
        const imagePathArray = Array.isArray(image_path)
            ? image_path
            : image_path
                ? [image_path]
                : [];
        try {
            const { data, error } = await supabase
                .from('items')
                .insert({
                item_name,
                description,
                image_path: imagePathArray,
                location,
                quantity,
                category_id,
                visible: visible ?? true,
            })
                .select()
                .single();
            if (error) {
                console.error('Error adding item: ', error);
                throw error;
            }
            return {
                message: 'Item added successfully',
                data: data,
            };
        }
        catch (err) {
            console.error('Failed to add item:', err);
            throw new Error('Failed to add item');
        }
    }
    async updateItem(req, itemId, item) {
        const supabase = req['supabase'];
        const { item_name, description, image_path, location, quantity, category_id, visible, } = item;
        const { data, error } = await supabase
            .from('items')
            .update({
            item_name,
            description,
            image_path,
            location,
            quantity,
            category_id,
            visible,
        })
            .eq('item_id', itemId)
            .select()
            .single();
        if (error) {
            console.error('Error updating item: ', error);
            throw error;
        }
        return {
            message: `Item: ${itemId} updated successfully`,
            data: data,
        };
    }
    async deleteItem(req, itemId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('items')
            .delete()
            .eq('item_id', itemId)
            .select()
            .single();
        if (error) {
            console.error('Error deleting item: ', error);
            throw error;
        }
        return {
            message: `Item: ${itemId} removed successfully`,
            data: data,
        };
    }
};
exports.ItemService = ItemService;
exports.ItemService = ItemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ItemService);
//# sourceMappingURL=items.service.js.map