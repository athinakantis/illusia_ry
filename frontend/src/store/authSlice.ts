import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    session: any | null;
}

const initialState: AuthState = {
    session: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<any>) {
            state.session = action.payload;
        },
        logout(state) {
            state.session = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
