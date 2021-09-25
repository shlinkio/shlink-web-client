import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import asideMenuCreator from '../../src/common/AsideMenu';
import { ReachableServer } from '../../src/servers/data';

describe('<AsideMenu />', () => {
  let wrapped: ShallowWrapper;
  const DeleteServerButton = () => null;

  beforeEach(() => {
    const AsideMenu = asideMenuCreator(DeleteServerButton);

    wrapped = shallow(<AsideMenu selectedServer={Mock.of<ReachableServer>({ id: 'abc123' })} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains links to different sections', () => {
    const links = wrapped.find('[to]');

    expect(links).toHaveLength(5);
    links.forEach((link) => expect(link.prop('to')).toContain('abc123'));
  });

  it('contains a button to delete server', () => {
    expect(wrapped.find(DeleteServerButton)).toHaveLength(1);
  });
});
