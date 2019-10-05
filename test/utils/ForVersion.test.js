import React from 'react';
import { mount } from 'enzyme';
import ForVersion from '../../src/utils/ForVersion';

describe('<ForVersion />', () => {
  let wrapped;

  const renderComponent = (minVersion, currentServerVersion) => {
    wrapped = mount(
      <ForVersion minVersion={minVersion} currentServerVersion={currentServerVersion}>
        <span>Hello</span>
      </ForVersion>
    );

    return wrapped;
  };

  afterEach(() => wrapped && wrapped.unmount());

  it('does not render children when current version is empty', () => {
    const wrapped = renderComponent('1', '');

    expect(wrapped.html()).toBeNull();
  });

  it('does not render children when current version is lower than min version', () => {
    const wrapped = renderComponent('2.0.0', '1.8.3');

    expect(wrapped.html()).toBeNull();
  });

  it('renders children when current version is equal min version', () => {
    const wrapped = renderComponent('2.0.0', '2.0.0');

    expect(wrapped.html()).toContain('<span>Hello</span>');
  });

  it('renders children when current version is higher than min version', () => {
    const wrapped = renderComponent('2.0.0', '2.1.0');

    expect(wrapped.html()).toContain('<span>Hello</span>');
  });
});
