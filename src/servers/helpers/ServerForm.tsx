import { FC, ReactNode, useEffect, useState } from 'react';
import { FormGroupContainer } from '../../utils/FormGroupContainer';
import { handleEventPreventingDefault } from '../../utils/utils';
import { ServerData } from '../data';
import { SimpleCard } from '../../utils/SimpleCard';
import './ServerForm.scss';

interface ServerFormProps {
  onSubmit: (server: ServerData) => void;
  initialValues?: ServerData;
  title?: ReactNode;
}

export const ServerForm: FC<ServerFormProps> = ({ onSubmit, initialValues, children, title }) => {
  const [ name, setName ] = useState('');
  const [ url, setUrl ] = useState('');
  const [ apiKey, setApiKey ] = useState('');
  const handleSubmit = handleEventPreventingDefault(() => onSubmit({ name, url, apiKey }));

  useEffect(() => {
    initialValues && setName(initialValues.name);
    initialValues && setUrl(initialValues.url);
    initialValues && setApiKey(initialValues.apiKey);
  }, [ initialValues ]);

  return (
    <form className="server-form" onSubmit={handleSubmit}>
      <SimpleCard className="mb-3" title={title}>
        <FormGroupContainer value={name} onChange={setName}>Name</FormGroupContainer>
        <FormGroupContainer type="url" value={url} onChange={setUrl}>URL</FormGroupContainer>
        <FormGroupContainer value={apiKey} onChange={setApiKey}>API key</FormGroupContainer>
      </SimpleCard>

      <div className="text-right">{children}</div>
    </form>
  );
};
