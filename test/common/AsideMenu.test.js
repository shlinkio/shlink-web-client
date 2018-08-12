import { shallow } from 'enzyme'
import React from 'react'
import AsideMenu from '../../src/common/AsideMenu'

describe('<AsideMenu />', () => {
  let wrapped;

  beforeEach(() => {
    wrapped = shallow(<AsideMenu selectedServer={{ id: 'abc123' }} />);
  });
  afterEach(() => {
    wrapped.unmount();
  });

  it('contains links to selected server', () => {
    const links = wrapped.find('NavLink');

    expect(links).toHaveLength(2);
    links.forEach(link => expect(link.prop('to')).toContain('abc123'));
  });

  it('contains a button to delete server', () => {
    expect(wrapped.find('DeleteServerButton')).toHaveLength(1);
  });
});
