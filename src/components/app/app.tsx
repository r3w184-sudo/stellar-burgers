import {
  AppHeader,
  GuestRoute,
  IngredientDetails,
  OrderInfo,
  OrderModal,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { ModalUI, Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps } from '@components/app/type.ts';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent ingredients={ingredients} isLoading={isLoading} error={error} />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;

  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <>
      {/* Основные маршруты: при background рендерится фоновая страница */}
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Прямой переход — страницы, а не модалки */}
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модалки только при background */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <ModalUI title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </ModalUI>
            }
          />
          <Route path="/feed/:number" element={<OrderModal />} />
          <Route path="/profile/orders/:number" element={<OrderModal />} />
        </Routes>
      )}
    </>
  );
};
