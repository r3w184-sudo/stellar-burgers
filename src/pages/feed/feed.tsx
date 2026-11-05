import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError,
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

const POLL_INTERVAL_MS = 15000;

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    void dispatch(fetchFeeds());

    const id = setInterval(() => {
      void dispatch(fetchFeeds());
    }, POLL_INTERVAL_MS);

    return (): void => {
      clearInterval(id);
    };
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium">Не удалось загрузить ленту: {error}</p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
