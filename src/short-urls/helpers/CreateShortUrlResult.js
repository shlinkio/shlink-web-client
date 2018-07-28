import React from 'react';
import { isNil } from 'ramda';

export default function CreateShortUrlResult ({ creationResult }) {
  if (creationResult.loading) {
    return <div className="text-center">Loading...</div>
  }

  if (creationResult.error) {
    return <div className="text-center color-danger">An error occurred while creating the URL :(</div>
  }

  if (isNil(creationResult.result)) {
    return null;
  }

  return <div className="text-center">Great!</div>;
};
