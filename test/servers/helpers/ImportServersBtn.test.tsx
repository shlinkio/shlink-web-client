import React from 'react';
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

  beforeEach(() => {
    jest.clearAllMocks();

    const ImportServersBtn = importServersBtnConstruct(serversImporterMock);

    wrapper = shallow(
      <ImportServersBtn createServers={createServersMock} fileRef={fileRef} onImport={onImportMock} />,
    );
  });
  afterEach(() => wrapper.unmount());

  it('renders a button, a tooltip and a file input', () => {
    expect(wrapper.find('#importBtn')).toHaveLength(1);
    expect(wrapper.find(UncontrolledTooltip)).toHaveLength(1);
    expect(wrapper.find('.create-server__csv-select')).toHaveLength(1);
  });

  it('triggers click on file ref when button is clicked', () => {
    const btn = wrapper.find('#importBtn');

    btn.simulate('click');

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('imports servers when file input changes', (done) => {
    const file = wrapper.find('.create-server__csv-select');

    file.simulate('change', { target: { files: [ '' ] } });

    setImmediate(() => {
      expect(serversImporterMock.importServersFromFile).toHaveBeenCalledTimes(1);
      expect(createServersMock).toHaveBeenCalledTimes(1);
      expect(onImportMock).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
