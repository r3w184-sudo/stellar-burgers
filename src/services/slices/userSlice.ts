import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

import type { RootState } from '../store';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean; // была ли попытка восстановить сессию при старте
  isLoading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const saveTokens = (accessToken: string, refreshToken: string): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

const hasTokens = (): boolean =>
  Boolean(getCookie('accessToken') ?? localStorage.getItem('refreshToken'));

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось зарегистрироваться'
    );
  }
});

export const loginUser = createAsyncThunk<TUser, TLoginData, { rejectValue: string }>(
  'user/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Не удалось войти');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      // даже при ошибке API локально считаем пользователя вышедшим
      clearTokens();
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка выхода');
    }
    clearTokens();
  }
);

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    // не дёргаем API, если токенов нет — избегаем лишнего 401
    if (!hasTokens()) {
      return rejectWithValue('no-session');
    }
    try {
      const response = await getUserApi();
      return response.user;
    } catch (err) {
      clearTokens();
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось получить пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось обновить данные'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      // logout — всегда чистим user, независимо от успеха API
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      // getUser — при любой ошибке молча считаем «не авторизован»
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = null; // отсутствие сессии — не ошибка
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const userReducer = userSlice.reducer;

export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState): boolean => state.user.isLoading;
export const selectUserError = (state: RootState): string | null => state.user.error;
