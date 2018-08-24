import React from 'react';
import { shallow } from 'enzyme';
import { CreateServer } from '../../src/servers/CreateServer';
import { identity } from 'ramda';
import sinon from 'sinon';
import ImportServersBtn from '../../src/servers/helpers/ImportServersBtn';

describe('<CreateServer />', () => {
  let wrapper;
  const createServerMock = sinon.fake();
  const historyMock = {
    push: sinon.fake(),
  };

  beforeEach(() => {
    createServerMock.resetHistory();
    historyMock.push.resetHistory();

    wrapper = shallow(
      <CreateServer
        createServer={createServerMock}
        resetSelectedServer={identity}
        history={historyMock}
      />
    );
  });
  afterEach(() => wrapper.unmount());

  it('renders components', () => {
    expect(wrapper.find('#name')).toHaveLength(1);
    expect(wrapper.find('#url')).toHaveLength(1);
    expect(wrapper.find('#apiKey')).toHaveLength(1);
    expect(wrapper.find(ImportServersBtn)).toHaveLength(1);
    expect(wrapper.find('.create-server__import-success-msg')).toHaveLength(0);
  });

  it('shows success message when imported is true', () => {
    wrapper.setState({ serversImported: true });
    expect(wrapper.find('.create-server__import-success-msg')).toHaveLength(1);
  });

  it('creates server and redirects to it when form is submitted', () => {
    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault: () => {} });

    expect(createServerMock.callCount).toEqual(1);
    expect(historyMock.push.callCount).toEqual(1);
  });

  it('updates state when inputs are changed', () => {
    const nameInput = wrapper.find('#name');
    const urlInput = wrapper.find('#url');
    const apiKeyInput = wrapper.find('#apiKey');

    nameInput.simulate('change', { target: { value: 'the_name' } });
    urlInput.simulate('change', { target: { value: 'the_url' } });
    apiKeyInput.simulate('change', { target: { value: 'the_api_key' } });

    expect(wrapper.state('name')).toEqual('the_name');
    expect(wrapper.state('url')).toEqual('the_url');
    expect(wrapper.state('apiKey')).toEqual('the_api_key');
  });
});
