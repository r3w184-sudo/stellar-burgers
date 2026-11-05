import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import {
  selectIngredients,
  selectIngredientsLoading,
} from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (isLoading && !ingredients.length) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
