import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button } from 'reactstrap';
import { DuplicatedServerModal } from '../../../src/servers/helpers/DuplicatedServerModal';
import { ServerData } from '../../../src/servers/data';

describe('<DuplicatedServerModal />', () => {
  const onDiscard = jest.fn();
  const onSave = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (serverData?: ServerData) => {
    wrapper = shallow(
      <DuplicatedServerModal
        serverData={serverData}
        isOpen={true}
        toggle={jest.fn()}
        onDiscard={onDiscard}
        onSave={onSave}
      />,
    );

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [ undefined ],
    [ Mock.of<ServerData>({ url: 'url', apiKey: 'apiKey' }) ],
  ])('displays provided server data', (serverData) => {
    const wrapper = createWrapper(serverData);
    const li = wrapper.find('li');

    expect(li.first().find('b').html()).toEqual(`<b>${serverData?.url ?? ''}</b>`);
    expect(li.last().find('b').html()).toEqual(`<b>${serverData?.apiKey ?? ''}</b>`);
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
