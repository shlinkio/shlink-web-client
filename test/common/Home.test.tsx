import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import Home, { HomeProps } from '../../src/common/Home';
import { ServerWithId } from '../../src/servers/data';
import { ShlinkLogo } from '../../src/common/img/ShlinkLogo';

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

  it('renders logo and title', () => {
    const wrapped = createComponent();

    expect(wrapped.find(ShlinkLogo)).toHaveLength(1);
    expect(wrapped.find('.home__title')).toHaveLength(1);
  });

  it.each([
    [
      {
        '1a': Mock.of<ServerWithId>({ name: 'foo', id: '1' }),
        '2b': Mock.of<ServerWithId>({ name: 'bar', id: '2' }),
      },
      0,
    ],
    [{}, 3 ],
  ])('shows link to create or set-up server only when no servers exist', (servers, expectedParagraphs) => {
    const wrapped = createComponent({ servers });
    const p = wrapped.find('p');

    expect(p).toHaveLength(expectedParagraphs);
  });
});
