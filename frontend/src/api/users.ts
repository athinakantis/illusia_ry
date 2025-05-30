import { api } from "./axios"
import { fetchUserRole, singleUserApiResponse, userApiResponse } from "../types/users.type"

export const usersApi = {
    getAllUsers: (): Promise<userApiResponse> =>
        api.get('admin/users',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),
    getUserById: (id: string): Promise<singleUserApiResponse> => {
        return api.get(`admin/user/${id}`)
    },
    getUserWithRoleById: (id: string): Promise<fetchUserRole> => {
        return api.get(`admin/user/${id}/role`)
    },
    getUsersWithRole: (): Promise<userApiResponse> => {
        return api.get('admin/users/role')
    },
    updateUserStatus: (
        userId: string,
        status: 'approved' | 'rejected' | 'deactivated' | 'active'
    ): Promise<userApiResponse> => {
        return api.patch(`admin/users/status`, {userId, status });
    },
    // Change a User's Role(Only for Head Admin) Better restrictions needed
    updateUserRole: (
        userId: string,
        role: 'Admin' | 'User' | 'Head Admin' | 'Banned'
    ): Promise<userApiResponse> => {
        return api.patch(`admin/users/role`, { userId, role });
    },
    // Promote a User to Admin(can only be done by Head Admin) 
    promoteToAdmin: (userId: string): Promise<userApiResponse> => {
        return api.patch(`admin/users/${userId}/promote-to-admin`, { userId });
    },
    // Aprove an Unapproved User to regular User
    approveToUser: (userId: string): Promise<userApiResponse> => {
        return api.patch(`admin/users/${userId}/approve`, { userId });
    },
    
}