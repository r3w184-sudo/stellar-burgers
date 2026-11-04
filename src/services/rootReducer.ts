import { combineReducers } from '@reduxjs/toolkit';
import { feedReducer } from '@slices/feedSlice.ts';
import { profileOrdersReducer } from '@slices/profileOrdersSlice.ts';
import { userReducer } from '@slices/userSlice.ts';

import { constructorReducer } from './slices/constructorSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { orderReducer } from './slices/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
});
