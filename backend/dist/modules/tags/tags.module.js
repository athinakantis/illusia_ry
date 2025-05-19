"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const common_1 = require("@nestjs/common");
const tags_service_1 = require("./tags.service");
const tags_controller_1 = require("./tags.controller");
const supabase_service_1 = require("../supabase/supabase.service");
let TagModule = class TagModule {
};
exports.TagModule = TagModule;
exports.TagModule = TagModule = __decorate([
    (0, common_1.Module)({
        providers: [tags_service_1.TagService, supabase_service_1.SupabaseService],
        exports: [tags_service_1.TagService],
        imports: [],
        controllers: [tags_controller_1.TagController],
    })
], TagModule);
//# sourceMappingURL=tags.module.js.map