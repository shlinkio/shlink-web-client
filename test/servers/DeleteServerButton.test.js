import React from 'react';
import { shallow } from 'enzyme';
import deleteServerButtonConstruct from '../../src/servers/DeleteServerButton';
import DeleteServerModal from '../../src/servers/DeleteServerModal';

describe('<DeleteServerButton />', () => {
  let wrapper;

  beforeEach(() => {
    const DeleteServerButton = deleteServerButtonConstruct(DeleteServerModal);

    wrapper = shallow(<DeleteServerButton server={{}} className="button" />);
  });
  afterEach(() => wrapper.unmount());

  it('renders a button and a modal', () => {
    expect(wrapper.find('.button')).toHaveLength(1);
    expect(wrapper.find(DeleteServerModal)).toHaveLength(1);
  });

  it('displays modal when button is clicked', () => {
    const btn = wrapper.find('.button');

    expect(wrapper.find(DeleteServerModal).prop('isOpen')).toEqual(false);
    btn.simulate('click');
    expect(wrapper.find(DeleteServerModal).prop('isOpen')).toEqual(true);
  });
});
