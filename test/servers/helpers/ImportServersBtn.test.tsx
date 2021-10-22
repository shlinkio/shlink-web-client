import { shallow, ShallowWrapper } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { Mock } from 'ts-mockery';
import importServersBtnConstruct from '../../../src/servers/helpers/ImportServersBtn';
import ServersImporter from '../../../src/servers/services/ServersImporter';

describe('<ImportServersBtn />', () => {
  let wrapper: ShallowWrapper;
  const onImportMock = jest.fn();
  const createServersMock = jest.fn();
  const serversImporterMock = Mock.of<ServersImporter>({
    importServersFromFile: jest.fn().mockResolvedValue([]),
  });
  const click = jest.fn();
  const fileRef = {
    current: Mock.of<HTMLInputElement>({ click }),
  };
  const ImportServersBtn = importServersBtnConstruct(serversImporterMock);
  const createWrapper = (className?: string) => {
    wrapper = shallow(
      <ImportServersBtn
        createServers={createServersMock}
        className={className}
        fileRef={fileRef}
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
    [ undefined, '' ],
    [ 'foo', 'foo' ],
    [ 'bar', 'bar' ],
  ])('allows a class name to be provided', (providedClassName, expectedClassName) => {
    const wrapper = createWrapper(providedClassName);

    expect(wrapper.find('#importBtn').prop('className')).toEqual(expectedClassName);
  });

  it('triggers click on file ref when button is clicked', () => {
    const wrapper = createWrapper();
    const btn = wrapper.find('#importBtn');

    btn.simulate('click');

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('imports servers when file input changes', (done) => {
    const wrapper = createWrapper();
    const file = wrapper.find('.import-servers-btn__csv-select');

    file.simulate('change', { target: { files: [ '' ] } });

    setImmediate(() => {
      expect(serversImporterMock.importServersFromFile).toHaveBeenCalledTimes(1);
      expect(createServersMock).toHaveBeenCalledTimes(1);
      expect(onImportMock).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
