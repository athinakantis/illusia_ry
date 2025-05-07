import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { User, UsersState } from '../types/users.type';
import { usersApi } from '../api/users';

const initialState: UsersState = {
  users: [], 
  loading: false,
  error: null,
  user: null,
  status: 'idle',
};

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async () => {
    const response = await usersApi.getAllUsers();
    return response.data;
  },
);
export const fetchAllUsersWithRole = createAsyncThunk(
    'users/fetchUsersWithRole',
    async () => {
      const response = await usersApi.getUsersWithRole();
      return response.data;
    },
  );
  
export const fetchUserById = createAsyncThunk<User, string>(
  'users/fetchUserById',
  async (id: string) => {
    const response = await usersApi.getUserById(id);
    const data = response.data;
    return Array.isArray(data) ? data[0] : data;
  },
);


export const fetchUserWithRoleById = createAsyncThunk<User, string>(
  'users/fetchUserWithRoleById',
  async (id: string) => {
    const response = await usersApi.getUserWithRoleById(id);
   
    const data = response.data;
    return Array.isArray(data) ? data[0] : data;
  },
);

export const updateUserStatus = createAsyncThunk<User, {userId: string; status: 'approved' | 'rejected' | 'deactivated' | 'active'}>(
  'users/updateUserStatus',
  async ({ userId, status }) => {
    const response = await usersApi.updateUserStatus(userId, status);
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    
    const data = response.data;

    return Array.isArray(data) ? data[0] : data;
  },
);

export const updateUserRole = createAsyncThunk<User, {userId: string; role: 'Admin' | 'User' | 'Head Admin'}>(
  'users/updateUserRole',
  async ({ userId, role }) => {
    const response = await usersApi.updateUserRole(userId, role);
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    const data = response.data;
    return Array.isArray(data) ? data[0] : data;
  },
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
      state.status = 'loading';
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not fetch users';
    });
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.status = 'loading';
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.user = action.payload; 
    });
    builder.addCase(fetchUserById.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not fetch user';
    });

    builder.addCase(fetchUserWithRoleById.pending, (state) => {
      state.loading = true;
      state.status = 'loading';
    });
    builder.addCase(fetchUserWithRoleById.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.user = action.payload; 
    });
    builder.addCase(fetchUserWithRoleById.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not fetch user with role';
    });

    builder.addCase(fetchAllUsersWithRole.pending, (state) => {
      state.loading = true;
      state.status = 'loading';
    });
    builder.addCase(fetchAllUsersWithRole.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.users = action.payload; 
    });
    builder.addCase(fetchAllUsersWithRole.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not fetch users with roles';
    });

   
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      const updatedUser: User = action.payload;
      const idx = state.users.findIndex(
        (u) => u.user_id === updatedUser.user_id,
      );
      if (idx !== -1) {
        state.users[idx] = updatedUser;
      }
      if (state.user && state.user.user_id === updatedUser.user_id) {
        state.user = updatedUser;
      }
    });
    builder.addCase(updateUserStatus.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not update user status';
    });
  
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      const updatedUser: User = action.payload;
      const idx = state.users.findIndex((u) => u.user_id === updatedUser.user_id);
      if (idx !== -1) {
        state.users[idx] = updatedUser;
      }
      if (state.user && state.user.user_id === updatedUser.user_id) {
        state.user = updatedUser;
      }
    });
    builder.addCase(updateUserRole.rejected, (state) => {
      state.loading = false;
      state.status = 'failed';
      state.error = 'Could not update user role';
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectAUser = (state: RootState) => state.users.user;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const CurrentUser = (state: RootState) => state.users.user;
export default usersSlice.reducer;
