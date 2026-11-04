import { OrderInfo } from '@/components';
import { ModalUI } from '@ui';
import { useNavigate, useParams } from 'react-router-dom';

const formatOrderNumber = (value: string): string => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return `#${value}`;
  return `#${String(numeric).padStart(6, '0')}`;
};

export const OrderModal = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <ModalUI title={formatOrderNumber(number ?? '')} onClose={closeModal}>
      <OrderInfo />
    </ModalUI>
  );
};
