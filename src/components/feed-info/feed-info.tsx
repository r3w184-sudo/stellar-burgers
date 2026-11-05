import { FeedInfoUI } from '@ui';

import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError,
} from '../../services/slices/feedSlice';
import { useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

const MAX_ORDERS_IN_COLUMN = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_ORDERS_IN_COLUMN);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error,
  };

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
