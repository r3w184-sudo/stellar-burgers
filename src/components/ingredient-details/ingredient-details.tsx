import { Preloader, IngredientDetailsUI } from '@ui';
import { useLocation, useParams } from 'react-router-dom';

import {
  selectIngredients,
  selectIngredientsLoading,
} from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

type TLocationState = { background?: Location } | null;

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  const isModal = Boolean((location.state as TLocationState | null)?.background);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (isLoading && !ingredients.length) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!isModal && (
        <h2 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h2>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
