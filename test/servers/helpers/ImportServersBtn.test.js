import React from 'react';
import { ImportServersBtn } from '../../../src/servers/helpers/ImportServersBtn';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';

describe('<ImportServersBtn />', () => {
  let wrapper;
  const onImportMock = sinon.fake();
  const createServersMock = sinon.fake();
  const serversImporterMock = {
    importServersFromFile: sinon.fake.returns(Promise.resolve([])),
  };
  const fileRef = {
    current: { click: sinon.fake() }
  };

  beforeEach(() => {
    onImportMock.resetHistory();
    createServersMock.resetHistory();
    serversImporterMock.importServersFromFile.resetHistory();
    fileRef.current.click.resetHistory();

    wrapper = shallow(
      <ImportServersBtn
        onImport={onImportMock}
        createServers={createServersMock}
        serversImporter={serversImporterMock}
        fileRef={fileRef}
      />
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

    expect(fileRef.current.click.callCount).toEqual(1);
  });

  it('imports servers when file input changes', done => {
    const file = wrapper.find('.create-server__csv-select');
    file.simulate('change', { target: { files: [''] } });

    setImmediate(() => {
      expect(serversImporterMock.importServersFromFile.callCount).toEqual(1);
      expect(createServersMock.callCount).toEqual(1);
      expect(onImportMock.callCount).toEqual(1);
      done();
    });
  });
});
