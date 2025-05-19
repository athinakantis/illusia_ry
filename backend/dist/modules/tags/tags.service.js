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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let TagService = class TagService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(req, dto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('tags')
            .insert({ tag_name: dto.tag_name, description: dto.description })
            .select('*')
            .maybeSingle();
        if (error?.code === '23505') {
            throw new common_1.BadRequestException(`Tag with the name "${dto.tag_name}" already exists`);
        }
        if (!data) {
            throw new common_1.BadRequestException('Failed to create tag');
        }
        if (error)
            throw new common_1.BadRequestException(error.message);
        return {
            message: 'Tag created',
            data: data
        };
    }
    async update(req, tag_id, dto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('tags')
            .update({
            tag_name: dto.tag_name,
            description: dto.description,
        })
            .eq('tag_id', tag_id)
            .select('*')
            .maybeSingle();
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!data)
            throw new common_1.NotFoundException('Tag not found');
        return { message: 'Tag updated', data: data };
    }
    async remove(req, tag_id) {
        const supabase = this.supabaseService.getClient();
        const { error, count } = await supabase
            .from('tags')
            .delete({ count: 'exact' })
            .eq('tag_id', tag_id);
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!count)
            throw new common_1.NotFoundException('Tag not found');
        return { message: `Tag ${tag_id} removed`, data: [] };
    }
    async addTagToItem(req, item_id, tag_id) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('item_tags')
            .insert({ item_id, tag_id })
            .select('*')
            .maybeSingle();
        if (error?.code === '23505') {
            throw new common_1.BadRequestException('Item already has this tag');
        }
        if (error)
            throw new common_1.BadRequestException(error.message);
        return { message: 'Tag linked to item', data: data };
    }
    async removeTagFromItem(req, item_id, tag_id) {
        const supabase = this.supabaseService.getClient();
        const { error, count } = await supabase
            .from('item_tags')
            .delete({ count: 'exact' })
            .eq('item_id', item_id)
            .eq('tag_id', tag_id);
        if (error)
            throw new common_1.BadRequestException(error.message);
        if (!count)
            throw new common_1.NotFoundException('Item is not tagged with the given tag');
        return { message: `Tag ${tag_id} removed from item ${item_id}`, data: [] };
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_service_1.SupabaseService)),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TagService);
//# sourceMappingURL=tags.service.js.map