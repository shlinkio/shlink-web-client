import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { ServerError } from '../../../src/servers/helpers/ServerError';

describe('<ServerError />', () => {
  let wrapper;

  afterEach(() => wrapper && wrapper.unmount());

  it.each([
    [
      'not-found',
      [ 'Could not find this Shlink server.' ],
      'These are the Shlink servers',
    ],
    [
      'not-reachable',
      [
        'Oops! Could not connect to this Shlink server.',
        'Make sure you have internet connection, and the server is properly configured and on-line.',
      ],
      'These are the other Shlink servers',
    ],
  ])('renders expected information based on type', (type, expectedTitleParts, expectedBody) => {
    wrapper = shallow(<BrowserRouter><ServerError type={type} servers={{ list: [] }} /></BrowserRouter>);
    const wrapperText = wrapper.html();
    const textsToFind = [ ...expectedTitleParts, ...expectedBody ];

    expect.assertions(textsToFind.length);
    textsToFind.forEach((text) => {
      expect(wrapperText).toContain(text);
    });
  });
});
