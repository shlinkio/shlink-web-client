import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { InputFormGroup } from '../../utils/forms/InputFormGroup';
import { handleEventPreventingDefault } from '../../utils/utils';
import { ServerData } from '../data';
import { SimpleCard } from '../../utils/SimpleCard';

type ServerFormProps = PropsWithChildren<{
  onSubmit: (server: ServerData) => void;
  initialValues?: ServerData;
  title?: ReactNode;
}>;

export const ServerForm: FC<ServerFormProps> = ({ onSubmit, initialValues, children, title }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const handleSubmit = handleEventPreventingDefault(() => onSubmit({ name, url, apiKey }));

  useEffect(() => {
    initialValues && setName(initialValues.name);
    initialValues && setUrl(initialValues.url);
    initialValues && setApiKey(initialValues.apiKey);
  }, [initialValues]);

  return (
    <form className="server-form" onSubmit={handleSubmit}>
      <SimpleCard className="mb-3" title={title}>
        <InputFormGroup value={name} onChange={setName}>Name</InputFormGroup>
        <InputFormGroup type="url" value={url} onChange={setUrl}>URL</InputFormGroup>
        <InputFormGroup value={apiKey} onChange={setApiKey}>API key</InputFormGroup>
      </SimpleCard>

      <div className="text-end">{children}</div>
    </form>
  );
};
