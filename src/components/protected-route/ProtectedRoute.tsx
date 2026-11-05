import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const ProtectedRoute = (): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  // пока сессия не восстановлена — не рискуем редиректить
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
