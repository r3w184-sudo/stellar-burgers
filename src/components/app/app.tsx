import {
  AppHeader,
  GuestRoute,
  IngredientDetails,
  Modal,
  OrderInfo,
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
import { Preloader } from '@ui';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useMatch } from 'react-router-dom';

import { formatOrderNumber } from '@utils/formated.ts';

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

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const orderNumber = feedOrderMatch?.params.number ?? profileOrderMatch?.params.number;

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
        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h2 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />

        {/* Страница заказа из ленты */}
        <Route
          path="/feed/:number"
          element={
            <div className={styles.detailPageWrap}>
              <h2 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
                {formatOrderNumber(orderNumber)}
              </h2>
              <OrderInfo />
            </div>
          }
        />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />

          {/* Страница заказа из истории */}
          <Route
            path="/profile/orders/:number"
            element={
              <div className={styles.detailPageWrap}>
                <h2 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
                  {formatOrderNumber(orderNumber)}
                </h2>
                <OrderInfo />
              </div>
            }
          />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модалки только при background */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title={formatOrderNumber(orderNumber)} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={
                <Modal title={formatOrderNumber(orderNumber)} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </>
  );
};
