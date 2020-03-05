import { shallow } from 'enzyme';
import React from 'react';
import asideMenuCreator from '../../src/common/AsideMenu';

describe('<AsideMenu />', () => {
  let wrapped;
  const DeleteServerButton = () => '';

  beforeEach(() => {
    const AsideMenu = asideMenuCreator(DeleteServerButton);

    wrapped = shallow(<AsideMenu selectedServer={{ id: 'abc123' }} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains links to different sections', () => {
    const links = wrapped.find('[to]');

    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link.prop('to')).toContain('abc123'));
  });

  it('contains a button to delete server', () => {
    expect(wrapped.find(DeleteServerButton)).toHaveLength(1);
  });
});
