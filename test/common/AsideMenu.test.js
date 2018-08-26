import { shallow } from 'enzyme';
import React from 'react';
import { NavLink } from 'react-router-dom';
import AsideMenu from '../../src/common/AsideMenu';

describe('<AsideMenu />', () => {
  let wrapped;

  beforeEach(() => {
    wrapped = shallow(<AsideMenu selectedServer={{ id: 'abc123' }} />);
  });
  afterEach(() => {
    wrapped.unmount();
  });

  it('contains links to different sections', () => {
    const links = wrapped.find(NavLink);
    const expectedLength = 3;

    expect(links).toHaveLength(expectedLength);
    links.forEach((link) => expect(link.prop('to')).toContain('abc123'));
  });

  it('contains a button to delete server', () => {
    expect(wrapped.find('DeleteServerButton')).toHaveLength(1);
  });
});
