import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { User, UsersState } from '../types/users.type';
import { usersApi

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

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string) => {
    const response = await usersApi.getUserById(id);
    return response.data;
  },
);

export const fetchUsersWithRole = createAsyncThunk(
  'users/fetchUsersWithRole',
  async () => {
    const response = await usersApi.getUsersWithRole();
    return response.data;
  },
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({
    userId,
    status,
  }: {
    userId: string;
    status: 'approved' | 'rejected';
  }) => {
    const response = await usersApi.updateUserStatus(userId, status);
    return response.data;
  },
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not fetch users';
    });
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not fetch user';
    });

    builder.addCase(fetchUsersWithRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsersWithRole.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsersWithRole.rejected, (state) => {
      state.loading = false;
      state.error = 'Could not fetch users with roles';
    });

    builder.addCase(updateUserStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      state.loading = false;
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
      state.error = 'Could not update user status';
    });
  },
});

export const selectUsers = (state: RootState) => state.users.users;
export const selectUser = (state: RootState) => state.users.user;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
