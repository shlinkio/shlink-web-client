import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button, ModalHeader } from 'reactstrap';
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
    [[], 0],
    [[Mock.all<ServerData>()], 2],
    [[Mock.all<ServerData>(), Mock.all<ServerData>()], 2],
    [[Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>()], 3],
    [[Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>()], 4],
  ])('renders expected amount of items', (duplicatedServers, expectedItems) => {
    const wrapper = createWrapper(duplicatedServers);
    const li = wrapper.find('li');

    expect(li).toHaveLength(expectedItems);
  });

  it.each([
    [
      [Mock.all<ServerData>()],
      {
        header: 'Duplicated server',
        firstParagraph: 'There is already a server with:',
        lastParagraph: 'Do you want to save this server anyway?',
        discardBtn: 'Discard',
      },
    ],
    [
      [Mock.all<ServerData>(), Mock.all<ServerData>()],
      {
        header: 'Duplicated servers',
        firstParagraph: 'The next servers already exist:',
        lastParagraph: 'Do you want to ignore duplicated servers?',
        discardBtn: 'Ignore duplicated',
      },
    ],
  ])('renders expected texts based on amount of servers', (duplicatedServers, assertions) => {
    const wrapper = createWrapper(duplicatedServers);
    const header = wrapper.find(ModalHeader);
    const p = wrapper.find('p');
    const span = wrapper.find('span');
    const discardBtn = wrapper.find(Button).first();

    expect(header.html()).toContain(assertions.header);
    expect(p.html()).toContain(assertions.firstParagraph);
    expect(span.html()).toContain(assertions.lastParagraph);
    expect(discardBtn.html()).toContain(assertions.discardBtn);
  });

  it.each([
    [[]],
    [[Mock.of<ServerData>({ url: 'url', apiKey: 'apiKey' })]],
  ])('displays provided server data', (duplicatedServers) => {
    const wrapper = createWrapper(duplicatedServers);
    const li = wrapper.find('li');

    if (duplicatedServers.length === 0) {
      expect(li).toHaveLength(0);
    } else if (duplicatedServers.length === 1) {
      expect(li.first().find('b').html()).toEqual(`<b>${duplicatedServers[0].url}</b>`);
      expect(li.last().find('b').html()).toEqual(`<b>${duplicatedServers[0].apiKey}</b>`);
    } else {
      expect.assertions(duplicatedServers.length);
      li.forEach((item, index) => {
        const server = duplicatedServers[index];

        expect(item.html()).toContain(`<b>${server.url}</b> - <b>${server.apiKey}</b>`);
      });
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
