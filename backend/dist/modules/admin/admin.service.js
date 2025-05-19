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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const mailer_service_1 = require("../mailer/mailer.service");
let AdminService = class AdminService {
    constructor(supabaseService, transporter) {
        this.supabaseService = supabaseService;
        this.transporter = transporter;
        this.supabaseService = supabaseService;
        this.transporter = transporter;
    }
    async assertAdmin(req) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data: isAdmin, error } = await supabase
            .rpc('is_user_admin', { p_user_id: userId });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!isAdmin) {
            throw new common_1.ForbiddenException('Admin privileges required');
        }
    }
    async assertStrictAdmin(req) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data: isStrictAdmin, error } = await supabase
            .rpc('is_user_strict_admin', { p_user_id: userId });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!isStrictAdmin) {
            throw new common_1.ForbiddenException('Strict Admin privileges required');
        }
    }
    async assertHeadAdmin(req) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data: isHeadAdmin, error } = await supabase
            .rpc('is_user_head_admin', { p_user_id: userId });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!isHeadAdmin) {
            throw new common_1.ForbiddenException('Head Admin privileges required');
        }
    }
    async getAllUsers(req) {
        await this.assertAdmin(req);
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('users')
            .select('user_id, display_name, email, user_status')
            .order('user_id', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'All users retrieved successfully',
            data: data ?? [],
        };
    }
    async getUserRoleById(req, userId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('user_with_roles_view')
            .select('role_title')
            .eq('user_id', userId)
            .maybeSingle();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} role retrieved successfully`,
            data: {
                role: data.role_title,
            },
        };
    }
    async getUsersWithRole(req) {
        await this.assertAdmin(req);
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('user_with_roles_view')
            .select("*")
            .order('user_id', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'All users retrieved successfully',
            data: data ?? [],
        };
    }
    async getUserById(req, userId) {
        await this.assertAdmin(req);
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('users')
            .select('user_id, display_name, email, user_status')
            .eq('user_id', userId)
            .maybeSingle();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} retrieved successfully`,
            data
        };
    }
    async promoteUserToAdmin(req, userId) {
        await this.assertHeadAdmin(req);
        const supabase = req['supabase'];
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('role_title', 'Admin')
            .maybeSingle();
        if (roleError) {
            throw new common_1.BadRequestException(roleError.message);
        }
        if (!role) {
            throw new common_1.NotFoundException('Admin role not found');
        }
        const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role_id: role.id })
            .eq('user_id', userId);
        if (updateError) {
            throw new common_1.BadRequestException(updateError.message);
        }
        const { data: updatedUser, error: fetchError } = await supabase
            .from('user_with_roles_view')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (fetchError) {
            throw new common_1.BadRequestException(fetchError.message);
        }
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} promoted to Admin successfully`,
            data: updatedUser ?? []
        };
    }
    async approveUserToUser(req, userId) {
        await this.assertAdmin(req);
        const supabase = req['supabase'];
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('role_title', 'User')
            .maybeSingle();
        if (roleError) {
            throw new common_1.BadRequestException(roleError.message);
        }
        if (!role) {
            throw new common_1.NotFoundException('User role not found');
        }
        const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role_id: role.id })
            .eq('user_id', userId);
        if (updateError) {
            throw new common_1.BadRequestException(updateError.message);
        }
        const { data: updatedUser, error: fetchError } = await supabase
            .from('user_with_roles_view')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (fetchError) {
            throw new common_1.BadRequestException(fetchError.message);
        }
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} approved to regular User role`,
            data: updatedUser ?? []
        };
    }
    async getRoleId(supabase, title) {
        const { data, error } = await supabase
            .from('roles')
            .select('id')
            .eq('role_title', title)
            .maybeSingle();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.NotFoundException(`${title} role not found`);
        }
        return data.id;
    }
    async updateUserRole(req, userId, roleTitle) {
        await this.assertAdmin(req);
        const supabase = req['supabase'];
        const roleId = await this.getRoleId(supabase, roleTitle);
        const { data: updatedRows, error: updateErr } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('user_id', userId)
            .select('user_id');
        if (updateErr) {
            throw new common_1.BadRequestException(updateErr.message);
        }
        if (!updatedRows || updatedRows.length === 0) {
            throw new common_1.NotFoundException(`Role mapping for user ${userId} not found`);
        }
        const { data: updatedUser, error: fetchErr } = await supabase
            .from('user_with_roles_view')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        console.log(`Updated user: ${JSON.stringify(updatedUser)}`);
        if (fetchErr) {
            throw new common_1.BadRequestException(fetchErr.message);
        }
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} role updated to "${roleTitle}"`,
            data: updatedUser,
        };
    }
    async updateUserStatus(req, userId, status) {
        await this.assertAdmin(req);
        const allowed = ['approved', 'rejected', 'deactivated', 'active'];
        if (!allowed.includes(status)) {
            throw new common_1.BadRequestException('Invalid status');
        }
        const supabase = req['supabase'];
        const { data: updatedUser, error: updateErr } = await supabase
            .from('users')
            .update({ user_status: status })
            .eq('user_id', userId)
            .select('user_id, display_name, email, user_status')
            .maybeSingle();
        if (updateErr) {
            throw new common_1.BadRequestException(updateErr.message);
        }
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return {
            message: `User ${userId} status updated to "${status}"`,
            data: updatedUser,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        mailer_service_1.MailerService])
], AdminService);
//# sourceMappingURL=admin.service.js.map