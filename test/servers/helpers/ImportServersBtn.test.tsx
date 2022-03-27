import { ReactNode } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { Mock } from 'ts-mockery';
import importServersBtnConstruct, { ImportServersBtnProps } from '../../../src/servers/helpers/ImportServersBtn';
import { ServersImporter } from '../../../src/servers/services/ServersImporter';
import { DuplicatedServersModal } from '../../../src/servers/helpers/DuplicatedServersModal';

describe('<ImportServersBtn />', () => {
  let wrapper: ShallowWrapper;
  const onImportMock = jest.fn();
  const createServersMock = jest.fn();
  const importServersFromFile = jest.fn().mockResolvedValue([]);
  const serversImporterMock = Mock.of<ServersImporter>({ importServersFromFile });
  const click = jest.fn();
  const fileRef = { current: Mock.of<HTMLInputElement>({ click }) };
  const ImportServersBtn = importServersBtnConstruct(serversImporterMock);
  const createWrapper = (props: Partial<ImportServersBtnProps & { children: ReactNode }> = {}) => {
    wrapper = shallow(
      <ImportServersBtn
        servers={{}}
        {...props}
        fileRef={fileRef}
        createServers={createServersMock}
        onImport={onImportMock}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper.unmount());

  it('renders a button, a tooltip and a file input', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('#importBtn')).toHaveLength(1);
    expect(wrapper.find(UncontrolledTooltip)).toHaveLength(1);
    expect(wrapper.find('.import-servers-btn__csv-select')).toHaveLength(1);
  });

  it.each([
    [undefined, ''],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('allows a class name to be provided', (providedClassName, expectedClassName) => {
    const wrapper = createWrapper({ className: providedClassName });

    expect(wrapper.find('#importBtn').prop('className')).toEqual(expectedClassName);
  });

  it.each([
    [undefined, true],
    ['foo', false],
    ['bar', false],
  ])('has expected text', (children, expectToHaveDefaultText) => {
    const wrapper = createWrapper({ children });

    if (expectToHaveDefaultText) {
      expect(wrapper.find('#importBtn').html()).toContain('Import from file');
    } else {
      expect(wrapper.find('#importBtn').html()).toContain(children);
      expect(wrapper.find('#importBtn').html()).not.toContain('Import from file');
    }
  });

  it('triggers click on file ref when button is clicked', () => {
    const wrapper = createWrapper();
    const btn = wrapper.find('#importBtn');

    btn.simulate('click');

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('imports servers when file input changes', async () => {
    const wrapper = createWrapper();
    const file = wrapper.find('.import-servers-btn__csv-select');

    await file.simulate('change', { target: { files: [''] } });

    expect(importServersFromFile).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['discard'],
    ['save'],
  ])('invokes callback in DuplicatedServersModal events', (event) => {
    const wrapper = createWrapper();

    wrapper.find(DuplicatedServersModal).simulate(event);

    expect(createServersMock).toHaveBeenCalledTimes(1);
    expect(onImportMock).toHaveBeenCalledTimes(1);
  });
});
