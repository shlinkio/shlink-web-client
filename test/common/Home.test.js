import { shallow } from 'enzyme';
import React from 'react';
import Home from '../../src/common/Home';

describe('<Home />', () => {
  let wrapped;
  const defaultProps = {
    resetSelectedServer: jest.fn(),
    servers: {},
  };
  const createComponent = (props) => {
    const actualProps = { ...defaultProps, ...props };

    wrapped = shallow(<Home {...actualProps} />);

    return wrapped;
  };

  afterEach(() => wrapped && wrapped.unmount());

  it('shows link to create server when no servers exist', () => {
    const wrapped = createComponent();

    expect(wrapped.find('Link')).toHaveLength(1);
  });

  it('asks to select a server when servers exist', () => {
    const servers = {
      1: { name: 'foo', id: '1' },
      2: { name: 'bar', id: '2' },
    };
    const wrapped = createComponent({ servers });
    const span = wrapped.find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toContain('Please, select a server.');
  });
});
