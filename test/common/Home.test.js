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

  it('resets selected server when mounted', () => {
    const resetSelectedServer = jest.fn();

    expect(resetSelectedServer).not.toHaveBeenCalled();
    createComponent({ resetSelectedServer });
    expect(resetSelectedServer).toHaveBeenCalled();
  });

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
});
