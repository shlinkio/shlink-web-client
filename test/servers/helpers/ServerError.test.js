import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { ServerError as createServerError } from '../../../src/servers/helpers/ServerError';

describe('<ServerError />', () => {
  let wrapper;
  const selectedServer = { id: '' };
  const ServerError = createServerError(() => '');

  afterEach(() => wrapper && wrapper.unmount());

  it.each([
    [
      'not-found',
      {
        'Could not find this Shlink server.': true,
        'Oops! Could not connect to this Shlink server.': false,
        'Make sure you have internet connection, and the server is properly configured and on-line.': false,
        'Alternatively, if you think you may have miss-configured this server': false,
      },
    ],
    [
      'not-reachable',
      {
        'Could not find this Shlink server.': false,
        'Oops! Could not connect to this Shlink server.': true,
        'Make sure you have internet connection, and the server is properly configured and on-line.': true,
        'Alternatively, if you think you may have miss-configured this server': true,
      },
    ],
  ])('renders expected information for type "%s"', (type, textsToFind) => {
    wrapper = shallow(
      <BrowserRouter>
        <ServerError type={type} servers={{ list: [] }} selectedServer={selectedServer} />
      </BrowserRouter>
    );
    const wrapperText = wrapper.html();
    const textPairs = Object.entries(textsToFind);

    textPairs.forEach(([ text, shouldBeFound ]) => {
      if (shouldBeFound) {
        expect(wrapperText).toContain(text);
      } else {
        expect(wrapperText).not.toContain(text);
      }
    });
  });
});
