import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? { name: 'FetchIngredientsError', message: action.payload }
          : action.error;
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;
