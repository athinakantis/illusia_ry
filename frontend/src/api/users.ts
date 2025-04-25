import { api } from "./axios"
import { userApiResponse } from "../types/users.type"

export const usersApi = {
    getAllUsers: (): Promise<userApiResponse> =>
        api.get('admin/users',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),
    getUserById: (id: string): Promise<userApiResponse> => {
        return api.get(`admin/user/${id}`)
    },
    getUserWithRoleById: (id: string): Promise<userApiResponse> => {
        return api.get(`admin/user/${id}/role`)
    },
    getUsersWithRole: (): Promise<userApiResponse> => {
        return api.get('admin/users/role')
    },
    updateUserStatus: (userId: string, status: 'approved' | 'rejected'): Promise<userApiResponse> => {
        return api.patch(`admin/users/${userId}/status`, { status });
    }
    
}