import React from 'react';
import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import OpenMapModalBtn from '../../../src/visits/helpers/OpenMapModalBtn';
import MapModal from '../../../src/visits/helpers/MapModal';

describe('<OpenMapModalBtn />', () => {
  let wrapper;
  const title = 'Foo';
  const locations = [];

  beforeEach(() => {
    wrapper = shallow(<OpenMapModalBtn modalTitle={title} locations={locations} />);
  });

  afterEach(() => wrapper.unmount());

  it('Renders expected content', () => {
    const button = wrapper.find('.open-map-modal-btn__btn');
    const tooltip = wrapper.find(UncontrolledTooltip);
    const modal = wrapper.find(MapModal);

    expect(button).toHaveLength(1);
    expect(tooltip).toHaveLength(1);
    expect(modal).toHaveLength(1);
  });

  it('changes modal visibility when toggled', () => {
    const modal = wrapper.find(MapModal);

    expect(wrapper.state('mapIsOpened')).toEqual(false);
    modal.prop('toggle')();
    expect(wrapper.state('mapIsOpened')).toEqual(true);
  });

  it('sets provided props to the map', () => {
    const modal = wrapper.find(MapModal);

    expect(modal.prop('title')).toEqual(title);
    expect(modal.prop('locations')).toEqual(locations);
  });
});
