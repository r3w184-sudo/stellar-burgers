import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const RESET_PASSWORD_FLAG = 'resetPassword';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    void forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem(RESET_PASSWORD_FLAG, 'true');
        void navigate('/reset-password', { replace: true });
      })
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message ?? ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
