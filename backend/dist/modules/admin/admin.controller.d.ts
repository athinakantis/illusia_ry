import { AdminService } from 'src/modules/admin/admin.service';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse, UserWithRole } from 'src/types/response';
export declare class AdminController {
    private readonly AdminsService;
    constructor(AdminsService: AdminService);
    getAllUsers(req: CustomRequest): Promise<ApiResponse<import("../../types/admin-user.type").AdminUserRow[]>>;
    getUsersWithRoles(req: CustomRequest): Promise<ApiResponse<{
        display_name: string | null;
        email: string | null;
        role_title: string | null;
        user_id: string | null;
        user_status: string | null;
    }[]>>;
    getUserById(req: CustomRequest, userId: string): Promise<ApiResponse<{
        display_name: string | null;
        email: string;
        user_id: string;
        user_status: string | null;
    }>>;
    getUserRole(req: CustomRequest, userId: string): Promise<ApiResponse<{
        role: string;
    }>>;
    updateUserStatus(req: CustomRequest, body: {
        status: 'approved' | 'rejected' | 'deactivated' | 'active';
        userId: string;
    }): Promise<ApiResponse<{
        display_name: string | null;
        email: string;
        user_id: string;
        user_status: string | null;
    }>>;
    updateAnyRole(req: CustomRequest, body: {
        role: string;
        userId: string;
    }): Promise<ApiResponse<UserWithRole>>;
    promoteUserToAdmin(req: CustomRequest, userId: string): Promise<ApiResponse<{
        display_name: string | null;
        email: string | null;
        role_title: string | null;
        user_id: string | null;
        user_status: string | null;
    }>>;
    approveUserToUser(req: CustomRequest, userId: string): Promise<ApiResponse<{
        display_name: string | null;
        email: string | null;
        role_title: string | null;
        user_id: string | null;
        user_status: string | null;
    }>>;
}
