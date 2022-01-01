import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button } from 'reactstrap';
import { DuplicatedServersModal } from '../../../src/servers/helpers/DuplicatedServersModal';
import { ServerData } from '../../../src/servers/data';

describe('<DuplicatedServersModal />', () => {
  const onDiscard = jest.fn();
  const onSave = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (duplicatedServers: ServerData[] = []) => {
    wrapper = shallow(
      <DuplicatedServersModal isOpen duplicatedServers={duplicatedServers} onDiscard={onDiscard} onSave={onSave} />,
    );

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [[]],
    [[ Mock.of<ServerData>({ url: 'url', apiKey: 'apiKey' }) ]],
  ])('displays provided server data', (duplicatedServers) => {
    const wrapper = createWrapper(duplicatedServers);
    const li = wrapper.find('li');

    if (duplicatedServers.length === 0) {
      expect(li).toHaveLength(0);
    } else {
      expect(li.first().find('b').html()).toEqual(`<b>${duplicatedServers[0].url}</b>`);
      expect(li.last().find('b').html()).toEqual(`<b>${duplicatedServers[0].apiKey}</b>`);
    }
  });

  it('invokes onDiscard when appropriate button is clicked', () => {
    const wrapper = createWrapper();
    const btn = wrapper.find(Button).first();

    btn.simulate('click');

    expect(onDiscard).toHaveBeenCalled();
  });

  it('invokes onSave when appropriate button is clicked', () => {
    const wrapper = createWrapper();
    const btn = wrapper.find(Button).last();

    btn.simulate('click');

    expect(onSave).toHaveBeenCalled();
  });
});
