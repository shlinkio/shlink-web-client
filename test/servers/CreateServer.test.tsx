import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { History } from 'history';
import createServerConstruct from '../../src/servers/CreateServer';
import { ServerForm } from '../../src/servers/helpers/ServerForm';

describe('<CreateServer />', () => {
  let wrapper: ShallowWrapper;
  const ImportServersBtn = () => null;
  const createServerMock = jest.fn();
  const push = jest.fn();
  const historyMock = Mock.of<History>({ push });
  const createWrapper = (serversImported = false) => {
    const CreateServer = createServerConstruct(ImportServersBtn, () => [ serversImported, () => '' ]);

    wrapper = shallow(
      <CreateServer createServer={createServerMock} resetSelectedServer={identity} history={historyMock} />,
    );

    return wrapper;
  };

  afterEach(() => {
    jest.resetAllMocks();
    wrapper?.unmount();
  });

  it('renders components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ServerForm)).toHaveLength(1);
    expect(wrapper.find('.create-server__import-success-msg')).toHaveLength(0);
  });

  it('shows success message when imported is true', () => {
    const wrapper = createWrapper(true);

    expect(wrapper.find('.create-server__import-success-msg')).toHaveLength(1);
  });

  it('creates server and redirects to it when form is submitted', () => {
    const wrapper = createWrapper();
    const form = wrapper.find(ServerForm);

    form.simulate('submit', {});

    expect(createServerMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
