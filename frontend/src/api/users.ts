import { api } from "./axios"
import { userApiResponse } from "../types/users.type"

export const usersApi = {
    getAllUsers: (): Promise<userApiResponse> =>
        api.get('users',
            { headers: { 'Access-Control-Allow-Origin': '*' } }
        ),
    getUserById: (id: string): Promise<userApiResponse> => {
        return api.get(`/users/${id}`)
    },
    getUsersWithRole: (): Promise<userApiResponse> => {
        return api.get('/users/with-role')
    },
    updateUserStatus: (userId: string, status: 'approved' | 'rejected'): Promise<userApiResponse> => {
        return api.patch(`/users/${userId}`, { status })
    }
    
}