import {
  Checkbox,
  Details,
  Label,
  LabelledInput,
  LabelledRevealablePasswordInput,
  SimpleCard,
  useToggle,
} from '@shlinkio/shlink-frontend-kit';
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
  );
  const handleSubmit = usePreventDefault(() => onSubmit({ name, url, apiKey, forwardCredentials }));

  return (
    <form name="serverForm" onSubmit={handleSubmit}>
      <SimpleCard className="mb-4" bodyClassName="flex flex-col gap-y-3" title={title}>
        <LabelledInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <LabelledInput label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <LabelledRevealablePasswordInput
          label="API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <Details summary="Advanced options">
          <div className="flex flex-col gap-0.5">
            <Label className="flex items-center gap-x-1.5 cursor-pointer">
              <Checkbox onChange={toggleForwardCredentials} checked={forwardCredentials} />
              Forward credentials to this server on every request.
            </Label>
            <small className="pl-5.5 text-gray-600 dark:text-gray-400 mt-0.5">
              {'"'}Credentials{'"'} here means cookies, TLS client certificates, or authentication headers containing a username
              and password.
            </small>
            <small className="pl-5.5 text-gray-600 dark:text-gray-400">
              <b>Important!</b> If you are not sure what this means, leave it unchecked. Enabling this option will
              make all requests fail for Shlink older than v4.5.0, as it requires the server to set a more strict
              value for <code className="whitespace-nowrap">Access-Control-Allow-Origin</code> than <code>*</code>.
            </small>
          </div>
        </Details>
      </SimpleCard>

      <div className="flex items-center justify-end gap-x-2">{children}</div>
    </form>
  );
};
