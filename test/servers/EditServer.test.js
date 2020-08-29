import React from 'react';
import { mount } from 'enzyme';
import { EditServer as editServerConstruct } from '../../src/servers/EditServer';
import { ServerForm } from '../../src/servers/helpers/ServerForm';

describe('<EditServer />', () => {
  let wrapper;
  const ServerError = jest.fn();
  const editServerMock = jest.fn();
  const historyMock = { push: jest.fn() };
  const match = {
    params: { serverId: 'abc123' },
  };
  const selectedServer = {
    id: 'abc123',
    name: 'name',
    url: 'url',
    apiKey: 'apiKey',
  };

  beforeEach(() => {
    const EditServer = editServerConstruct(ServerError);

    wrapper = mount(
      <EditServer
        editServer={editServerMock}
        history={historyMock}
        match={match}
        selectedServer={selectedServer}
        selectServer={jest.fn()}
      />,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    wrapper && wrapper.unmount();
  });

  it('renders components', () => {
    expect(wrapper.find(ServerForm)).toHaveLength(1);
  });

  it('edits server and redirects to it when form is submitted', () => {
    const form = wrapper.find(ServerForm);

    form.simulate('submit', {});

    expect(editServerMock).toHaveBeenCalledTimes(1);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
  });
});
