import { useToggle } from '@shlinkio/shlink-frontend-kit';
import {
  Checkbox,
  Details,
  Label,
  LabelledInput,
  LabelledRevealablePasswordInput,
  SimpleCard,
} from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { usePreventDefault } from '../../utils/utils';
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
  const { flag: forwardCredentials, toggle: toggleForwardCredentials } = useToggle(
    initialValues?.forwardCredentials ?? false,
    true,
  );
  const handleSubmit = usePreventDefault(() => onSubmit({ name, url, apiKey, forwardCredentials }));

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
        <Details summary="Advanced options">
          <div className="tw:flex tw:flex-col tw:gap-1">
            <Label className="tw:flex tw:items-center tw:gap-x-1.5 tw:cursor-pointer">
              <Checkbox onChange={toggleForwardCredentials} checked={forwardCredentials} />
              Forward credentials (like cookies) to this server on every request.
            </Label>
            <small className="tw:pl-5.5 tw:text-gray-600 tw:dark:text-gray-400">
              <b>Important!</b> If you are not sure what this means, leave it unchecked. Enabling this option will
              make all requests fail for Shlink older than v4.5.0, as it requires the server to set a more strict
              value for <code className="tw:whitespace-nowrap">Access-Control-Allow-Origin</code> than <code>*</code>.
            </small>
          </div>
        </Details>
      </SimpleCard>

      <div className="tw:flex tw:items-center tw:justify-end tw:gap-x-2">{children}</div>
    </form>
  );
};
