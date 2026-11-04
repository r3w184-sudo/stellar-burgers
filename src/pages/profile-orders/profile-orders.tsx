import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError,
} from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

const POLL_INTERVAL_MS = 15000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    void dispatch(fetchProfileOrders());

    const id = setInterval(() => {
      void dispatch(fetchProfileOrders());
    }, POLL_INTERVAL_MS);

    return (): void => {
      clearInterval(id);
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium">Не удалось загрузить историю: {error}</p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
