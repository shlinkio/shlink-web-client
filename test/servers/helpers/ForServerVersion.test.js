import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import ForServerVersion from '../../../src/servers/helpers/ForServerVersion';

describe('<ForServerVersion />', () => {
  let wrapped;

  const renderComponent = (minVersion, maxVersion, selectedServer) => {
    wrapped = mount(
      <ForServerVersion minVersion={minVersion} maxVersion={maxVersion} selectedServer={selectedServer}>
        <span>Hello</span>
      </ForServerVersion>
    );

    return wrapped;
  };

  afterEach(() => wrapped && wrapped.unmount());

  it('does not render children when current server is empty', () => {
    const wrapped = renderComponent('1');

    expect(wrapped.html()).toBeNull();
  });

  each([
    [ '2.0.0', undefined, '1.8.3' ],
    [ undefined, '1.8.0', '1.8.3' ],
    [ '1.7.0', '1.8.0', '1.8.3' ],
  ]).it('does not render children when current version does not match requirements', (min, max, version) => {
    const wrapped = renderComponent(min, max, { version });

    expect(wrapped.html()).toBeNull();
  });

  each([
    [ '2.0.0', undefined, '2.8.3' ],
    [ '2.0.0', undefined, '2.0.0' ],
    [ undefined, '1.8.0', '1.8.0' ],
    [ undefined, '1.8.0', '1.7.1' ],
    [ '1.7.0', '1.8.0', '1.7.3' ],
  ]).it('renders children when current version matches requirements', (min, max, version) => {
    const wrapped = renderComponent(min, max, { version });

    expect(wrapped.html()).toContain('<span>Hello</span>');
  });
});
