import React from 'react';
import { mount } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'reactstrap';
import UseExistingIfFoundInfoIcon from '../../src/short-urls/UseExistingIfFoundInfoIcon';

describe('<UseExistingIfFoundInfoIcon />', () => {
  let wrapped;

  beforeEach(() => {
    wrapped = mount(<UseExistingIfFoundInfoIcon />);
  });

  afterEach(() => wrapped.unmount());

  it('shows modal when icon is clicked', () => {
    const icon = wrapped.find(FontAwesomeIcon);

    expect(wrapped.find(Modal).prop('isOpen')).toEqual(false);
    icon.simulate('click');
    expect(wrapped.find(Modal).prop('isOpen')).toEqual(true);
  });
});
