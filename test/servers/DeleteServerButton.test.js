import React from 'react';
import DeleteServerButton from '../../src/servers/DeleteServerButton';
import { shallow } from 'enzyme';
import DeleteServerModal from '../../src/servers/DeleteServerModal';

describe('<DeleteServerButton />', () => {
  let wrapper;

  beforeEach(() =>
      wrapper = shallow(<DeleteServerButton server={{}} className="button" />));
  afterEach(() => wrapper.unmount());

  it('renders a button and a modal', () => {
    expect(wrapper.find('.button')).toHaveLength(1);
    expect(wrapper.find(DeleteServerModal)).toHaveLength(1);
  });

  it('displays modal when button is clicked', () => {
    const btn = wrapper.find('.button');

    expect(wrapper.state('isModalOpen')).toEqual(false);
    btn.simulate('click');
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('changes modal open state when toggled', () => {
    const modal = wrapper.find(DeleteServerModal);

    expect(wrapper.state('isModalOpen')).toEqual(false);
    modal.prop('toggle')();
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });
});
