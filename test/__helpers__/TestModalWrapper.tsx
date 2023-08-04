import { useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC, ReactElement } from 'react';

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
