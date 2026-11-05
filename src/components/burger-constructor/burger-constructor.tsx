import { selectUser } from '@slices/userSlice.ts';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '../../services/slices/constructorSlice';
import {
  clearOrderModal,
  orderBurger,
  selectOrderModalData,
  selectOrderRequest,
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const constructorItems = { bun, ingredients };

  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    void dispatch(orderBurger(ids));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) + ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
