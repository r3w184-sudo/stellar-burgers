import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const RESET_PASSWORD_FLAG = 'resetPassword';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // проверка флага — до рендера формы
  const hasAccess = localStorage.getItem(RESET_PASSWORD_FLAG) === 'true';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    void resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem(RESET_PASSWORD_FLAG);
        void navigate('/login', { replace: true });
      })
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  };

  if (!hasAccess) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <ResetPasswordUI
      errorText={error?.message ?? ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
