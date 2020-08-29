import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Mock } from 'ts-mockery';
import Home, { HomeProps } from '../../src/common/Home';
import { ServerWithId } from '../../src/servers/data';

describe('<Home />', () => {
  let wrapped: ShallowWrapper;
  const defaultProps = {
    resetSelectedServer: jest.fn(),
    servers: {},
  };
  const createComponent = (props: Partial<HomeProps> = {}) => {
    const actualProps = { ...defaultProps, ...props };

    wrapped = shallow(<Home {...actualProps} />);

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('shows link to create server when no servers exist', () => {
    const wrapped = createComponent();

    expect(wrapped.find('Link')).toHaveLength(1);
  });

  it('asks to select a server when servers exist', () => {
    const servers = {
      '1a': Mock.of<ServerWithId>({ name: 'foo', id: '1' }),
      '2b': Mock.of<ServerWithId>({ name: 'bar', id: '2' }),
    };
    const wrapped = createComponent({ servers });
    const span = wrapped.find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toContain('Please, select a server.');
  });
});
