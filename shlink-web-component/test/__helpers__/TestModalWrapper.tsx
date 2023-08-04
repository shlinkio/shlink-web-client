import type { FC, ReactElement } from 'react';
import { useToggle } from '../../../shlink-frontend-kit/src';

interface RenderModalArgs {
  isOpen: boolean;
  toggle: () => void;
}

export const TestModalWrapper: FC<{ renderModal: (args: RenderModalArgs) => ReactElement }> = (
  { renderModal },
) => {
  const [isOpen, toggle] = useToggle(true);
  return renderModal({ isOpen, toggle });
};
