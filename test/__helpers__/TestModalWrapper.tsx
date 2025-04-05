import type { FC, ReactElement } from 'react';
import { useCallback, useEffect , useState } from 'react';

export type RenderModalArgs = {
  open: boolean;
  onClose: () => void;
};

export const TestModalWrapper: FC<{ renderModal: (args: RenderModalArgs) => ReactElement }> = (
  { renderModal },
) => {
  const [open, setOpen] = useState(true);
  const onClose = useCallback(() => setOpen(false), []);

  // Workaround to ensure CardModals from shlink-frontend-shared can be closed, as they depend on CSS transitions
  // Since JSDOM does not support them, this dispatches the event right after the listener has been set-up
  useEffect(() => {
    if (!open) {
      document.querySelector('[data-testid="transition-container"]')?.dispatchEvent(new Event('transitionend'));
    }
  }, [open]);

  return renderModal({ open, onClose });
};
