import React from 'react';
import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import importServersBtnConstruct from '../../../src/servers/helpers/ImportServersBtn';

describe('<ImportServersBtn />', () => {
  let wrapper;
  const onImportMock = jest.fn();
  const createServersMock = jest.fn();
  const serversImporterMock = {
    importServersFromFile: jest.fn().mockResolvedValue([]),
  };
  const fileRef = {
    current: { click: jest.fn() },
  };

  beforeEach(() => {
    onImportMock.mockReset();
    createServersMock.mockReset();
    serversImporterMock.importServersFromFile.mockClear();
    fileRef.current.click.mockReset();

    const ImportServersBtn = importServersBtnConstruct(serversImporterMock);

    wrapper = shallow(
      <ImportServersBtn createServers={createServersMock} fileRef={fileRef} onImport={onImportMock} />
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

    expect(fileRef.current.click).toHaveBeenCalledTimes(1);
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
