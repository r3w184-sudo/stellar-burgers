import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  viewedOrder: TOrder | null; // ← заказ, открытый по прямому переходу
  isLoadingViewed: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  viewedOrder: null,
  isLoadingViewed: false,
  error: null,
};

export const orderBurger = createAsyncThunk<TOrder, string[], { rejectValue: string }>(
  'order/orderBurger',
  async (ids, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ids);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось оформить заказ'
      );
    }
  }
);

// ← новый thunk для прямого перехода на /feed/:number и /profile/orders/:number
export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    const order = data.orders[0];
    if (!order) {
      return rejectWithValue('Заказ не найден');
    }
    return order;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить заказ'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    },
    clearViewedOrder: (state) => {
      state.viewedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingViewed = true;
        state.error = null;
        state.viewedOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingViewed = false;
        state.viewedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingViewed = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearOrderModal, clearViewedOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;
export const selectViewedOrder = (state: RootState): TOrder | null =>
  state.order.viewedOrder;
export const selectViewedOrderLoading = (state: RootState): boolean =>
  state.order.isLoadingViewed;
export const selectOrderError = (state: RootState): string | null => state.order.error;
