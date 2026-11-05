import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  registerUser,
  selectUserError,
  selectUserLoading,
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type TLocationState = { from?: { pathname?: string } } | null;

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
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

    void dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => {
        // ошибка уже в state.user.error — RegisterUI покажет через errorText
      });
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
