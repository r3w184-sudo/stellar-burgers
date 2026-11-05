import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить историю заказов'
    );
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // сервер отдаёт заказы от старых к новым — разворачиваем,
        // чтобы сверху были последние
        state.orders = [...action.payload].reverse();
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState): boolean =>
  state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: RootState): string | null =>
  state.profileOrders.error;
