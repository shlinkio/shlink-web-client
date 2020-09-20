import { ChangeEvent, FC } from 'react';

export const pointerOnHover = ({ target }: ChangeEvent<HTMLElement>, chartElement: FC[]) => {
  target.style.cursor = chartElement[0] ? 'pointer' : 'default';
};
