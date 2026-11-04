import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  loginUser,
  selectUserError,
  selectUserLoading,
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type TLocationState = { from?: { pathname?: string } } | null;

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isLoading) return;

    const from = (location.state as TLocationState)?.from?.pathname ?? '/';

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => {
        /* empty */
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
