import React from 'react';
import { isNil } from 'ramda';

export default function CreateShortUrlResult ({ loading, error, result }) {
  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center color-danger">An error occurred while creating the URL :(</div>
  }

  if (isNil(result)) {
    return null;
  }

  return <div className="text-center">Great!</div>;
};
