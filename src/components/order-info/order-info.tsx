import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectOrderModalData,
  selectViewedOrder,
  selectViewedOrderLoading,
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const modalOrder = useSelector(selectOrderModalData);
  const viewedOrder = useSelector(selectViewedOrder);
  const isLoadingViewed = useSelector(selectViewedOrderLoading);

  const storeOrder: TOrder | null =
    modalOrder && modalOrder.number === orderNumber
      ? modalOrder
      : viewedOrder && viewedOrder.number === orderNumber
        ? viewedOrder
        : null;

  useEffect(() => {
    if (Number.isNaN(orderNumber)) return;
    if (storeOrder) return;
    void dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, storeOrder]);

  const orderData = storeOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      (typeof ingredients)[number] & { count: number }
    >;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (isLoadingViewed || !ingredients.length) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <p className="text text_type_main-medium">Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
