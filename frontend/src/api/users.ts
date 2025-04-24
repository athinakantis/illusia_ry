import { api } from "./axios"
import { userApiResponse } from "../types/users.type"

export const usersApi = {
    getAllUsers: (): Promise<userApiResponse> =>
        api.get('users',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),
    getUserById: (id: string): Promise<userApiResponse> => {
        return api.get(`/user/${id}`)
    },
    getUserWithRoleById: (id: string): Promise<userApiResponse> => {
        return api.get(`/user/${id}/role`)
    },
    getUsersWithRole: (): Promise<userApiResponse> => {
        return api.get('/users/role')
    },
    updateUserStatus: (userId: string, status: 'approved' | 'rejected'): Promise<userApiResponse> => {
        return api.patch(`/users/${userId}`, { status })
    }
    
}