import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HorizontalFormGroup } from '../../utils/HorizontalFormGroup';
import { handleEventPreventingDefault } from '../../utils/utils';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
  }),
  children: PropTypes.node.isRequired,
};

export const ServerForm = ({ onSubmit, initialValues, children }) => {
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
    <form onSubmit={handleSubmit}>
      <HorizontalFormGroup value={name} onChange={setName}>Name</HorizontalFormGroup>
      <HorizontalFormGroup type="url" value={url} onChange={setUrl}>URL</HorizontalFormGroup>
      <HorizontalFormGroup value={apiKey} onChange={setApiKey}>API key</HorizontalFormGroup>

      <div className="text-right">{children}</div>
    </form>
  );
};

ServerForm.propTypes = propTypes;
