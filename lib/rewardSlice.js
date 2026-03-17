import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "./endpoints";

// Create thunk to fetch reward data (referral code, total earnings etc.)
export const fetchReward = createAsyncThunk(
    'reward/fetchReward',
    async (_, thunkAPI) => {
        try {
            // Access the state to get the token
            const state = thunkAPI.getState();
            // In web app, token might be in state.user.token or similar. 
            // Based on AuthContext, it seems to be in localStorage or Context, 
            // but for Redux, we should check where it is stored. 
            // The mobile app used state.user.userData.jwt.
            // Let's assume standard Redux state structure or pass it if needed.
            // However, looking at store.js, it has userReducer.
            // Let's check userSlice.js to be sure about the state structure.
            // For now, I will assume state.user.token or state.user.currentUser.jwt

            // Wait, I should check userSlice.js in the next step to be sure.
            // But for now I'll use a safe accessor or getting from localStorage if Redux fails, 
            // though Redux thunk is best with Redux state.

            const token = state.user?.token || localStorage.getItem('token');

            if (!token) {
                return thunkAPI.rejectWithValue({ error: 'No authentication token found' });
            }

            // The mobile app used: ${BASE_URL}api/referrals
            // Our BASE_URL is /api/proxy/
            // So url = /api/proxy/api/referrals
            let url = `${BASE_URL}api/referrals`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return thunkAPI.rejectWithValue({ error: errorData.message || 'Failed to fetch rewards' });
            }

            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const fetchRewardDashboard = createAsyncThunk(
    'reward/fetchRewardDashboard',
    async ({ id }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.user?.token || localStorage.getItem('token');

            if (!token) {
                return thunkAPI.rejectWithValue({ error: 'No authentication token found' });
            }

            let url = `${BASE_URL}api/referrals/${id}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return thunkAPI.rejectWithValue({ error: errorData.message || 'Failed to fetch reward dashboard' });
            }

            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

const rewardSlice = createSlice({
    name: 'reward',
    initialState: {
        rewardData: null,
        dashboardData: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearRewardData: (state) => {
            state.rewardData = null;
            state.dashboardData = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchReward cases
            .addCase(fetchReward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReward.fulfilled, (state, action) => {
                state.loading = false;
                state.rewardData = action.payload;
            })
            .addCase(fetchReward.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || action.error.message;
            })
            // fetchRewardDashboard cases
            .addCase(fetchRewardDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchRewardDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || action.error.message;
            });
    }
});

export const { clearRewardData } = rewardSlice.actions;
export default rewardSlice.reducer;
