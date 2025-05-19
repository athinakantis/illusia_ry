import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';
import { ApiResponse, UserWithRole } from 'src/types/response';
import { AdminUserRow } from 'src/types/admin-user.type';
import { SupabaseService } from 'src/modules/supabase/supabase.service';
import { MailerService } from '../mailer/mailer.service';
export declare class AdminService {
    private readonly supabaseService;
    private readonly transporter;
    constructor(supabaseService: SupabaseService, transporter: MailerService);
    private assertAdmin;
    private assertStrictAdmin;
    private assertHeadAdmin;
    getAllUsers(req: CustomRequest): Promise<ApiResponse<AdminUserRow[]>>;
    getUserRoleById(req: CustomRequest, userId: string): Promise<ApiResponse<{
        role: string;
    }>>;
    getUsersWithRole(req: CustomRequest): Promise<ApiResponse<UserWithRole[]>>;
    getUserById(req: CustomRequest, userId: string): Promise<ApiResponse<Tables<'users'>>>;
    promoteUserToAdmin(req: CustomRequest, userId: string): Promise<ApiResponse<UserWithRole>>;
    approveUserToUser(req: CustomRequest, userId: string): Promise<ApiResponse<UserWithRole>>;
    private getRoleId;
    updateUserRole(req: CustomRequest, userId: string, roleTitle: string): Promise<ApiResponse<UserWithRole>>;
    updateUserStatus(req: CustomRequest, userId: string, status: 'approved' | 'rejected' | 'deactivated' | 'active'): Promise<ApiResponse<Tables<'users'>>>;
}
