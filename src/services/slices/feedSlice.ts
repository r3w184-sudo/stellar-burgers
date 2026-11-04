import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

type TFeedsResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить ленту'
    );
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const feedReducer = feedSlice.reducer;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;
export const selectFeedLoading = (state: RootState): boolean => state.feed.isLoading;
export const selectFeedError = (state: RootState): string | null => state.feed.error;
