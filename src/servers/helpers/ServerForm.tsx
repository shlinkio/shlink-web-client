import {
  LabelledInput,
  LabelledRevealablePasswordInput,
  SimpleCard,
} from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { handleEventPreventingDefault } from '../../utils/utils';
import type { ServerData } from '../data';

type ServerFormProps = PropsWithChildren<{
  onSubmit: (server: ServerData) => void;
  initialValues?: ServerData;
  title?: ReactNode;
}>;

export const ServerForm: FC<ServerFormProps> = ({ onSubmit, initialValues, children, title }) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [apiKey, setApiKey] = useState(initialValues?.apiKey ?? '');
  const handleSubmit = handleEventPreventingDefault(() => onSubmit({ name, url, apiKey }));

  return (
    <form name="serverForm" onSubmit={handleSubmit}>
      <SimpleCard className="tw:mb-4" bodyClassName="tw:flex tw:flex-col tw:gap-y-3" title={title}>
        <LabelledInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <LabelledInput label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <LabelledRevealablePasswordInput
          label="API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
      </SimpleCard>

      <div className="tw:flex tw:items-center tw:justify-end tw:gap-x-2">{children}</div>
    </form>
  );
};
