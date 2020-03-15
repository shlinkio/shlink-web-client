import React from 'react';
import { shallow } from 'enzyme';
import { ServerForm } from '../../../src/servers/helpers/ServerForm';
import { HorizontalFormGroup } from '../../../src/utils/HorizontalFormGroup';

describe('<ServerForm />', () => {
  let wrapper;
  const onSubmit = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<ServerForm onSubmit={onSubmit}><span>Something</span></ServerForm>);
  });

  afterEach(() => {
    jest.resetAllMocks();
    wrapper && wrapper.unmount();
  });

  it('renders components', () => {
    expect(wrapper.find(HorizontalFormGroup)).toHaveLength(3);
    expect(wrapper.find('span')).toHaveLength(1);
  });

  it('invokes submit callback when submit event is triggered', () => {
    const form = wrapper.find('form');
    const preventDefault = jest.fn();

    form.simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });
});
