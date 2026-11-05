import { AppHeaderUI } from '@ui';

import { selectUser } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
