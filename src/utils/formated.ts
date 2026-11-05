export const formatOrderNumber = (value: string | undefined): string => {
  if (!value) return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return `#${value}`;
  return `#${String(numeric).padStart(6, '0')}`;
};
