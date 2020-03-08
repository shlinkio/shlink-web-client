import { shallow } from 'enzyme';
import React from 'react';
import Home from '../../src/common/Home';

describe('<Home />', () => {
  let wrapped;
  const defaultProps = {
    resetSelectedServer: jest.fn(),
    servers: { loading: false, list: {} },
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

  it('shows message when loading servers', () => {
    const wrapped = createComponent({ servers: { loading: true } });
    const span = wrapped.find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toContain('Trying to load servers...');
  });

  it('Asks to select a server when not loadign and servers exist', () => {
    const list = [
      { name: 'foo', id: '1' },
      { name: 'bar', id: '2' },
    ];
    const wrapped = createComponent({ servers: { list } });
    const span = wrapped.find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toContain('Please, select a server.');
  });
});
