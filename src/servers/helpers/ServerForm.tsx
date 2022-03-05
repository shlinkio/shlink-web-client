import { FC, ReactNode, useEffect, useState } from 'react';
import { FormGroupContainer, FormGroupContainerProps } from '../../utils/forms/FormGroupContainer';
import { handleEventPreventingDefault } from '../../utils/utils';
import { ServerData } from '../data';
import { SimpleCard } from '../../utils/SimpleCard';
import './ServerForm.scss';

interface ServerFormProps {
  onSubmit: (server: ServerData) => void;
  initialValues?: ServerData;
  title?: ReactNode;
}

const FormGroup: FC<FormGroupContainerProps> = (props) =>
  <FormGroupContainer {...props} labelClassName="server-form__label" />;

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
        <FormGroup value={name} onChange={setName}>Name</FormGroup>
        <FormGroup type="url" value={url} onChange={setUrl}>URL</FormGroup>
        <FormGroup value={apiKey} onChange={setApiKey}>API key</FormGroup>
      </SimpleCard>

      <div className="text-end">{children}</div>
    </form>
  );
};
