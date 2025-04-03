import type { FC, ReactElement } from 'react';
import { useCallback, useState } from 'react';

export type RenderModalArgs = {
  open: boolean;
  onClose: () => void;
};

export const TestModalWrapper: FC<{ renderModal: (args: RenderModalArgs) => ReactElement }> = (
  { renderModal },
) => {
  const [open, setOpen] = useState(true);
  const onClose = useCallback(() => setOpen(false), []);

  return renderModal({ open, onClose });
};
