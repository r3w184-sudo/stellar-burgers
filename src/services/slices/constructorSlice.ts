import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null; // ← было TIngredient | null
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (from === to) return;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

export const selectConstructorBun = (state: RootState): TConstructorIngredient | null =>
  state.burgerConstructor.bun; // ← тип тоже

export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;
