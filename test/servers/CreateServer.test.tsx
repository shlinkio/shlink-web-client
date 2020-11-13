import { shallow, ShallowWrapper } from 'enzyme';
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
  const createWrapper = (serversImported = false, importFailed = false) => {
    const useStateFlagTimeout = jest.fn()
      .mockReturnValueOnce([ serversImported, () => '' ])
      .mockReturnValueOnce([ importFailed, () => '' ]);
    const CreateServer = createServerConstruct(ImportServersBtn, useStateFlagTimeout);

    wrapper = shallow(<CreateServer createServer={createServerMock} history={historyMock} />);

    return wrapper;
  };

  afterEach(() => {
    jest.resetAllMocks();
    wrapper?.unmount();
  });

  it('renders components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ServerForm)).toHaveLength(1);
    expect(wrapper.find('Result')).toHaveLength(0);
  });

  it('shows success message when imported is true', () => {
    const wrapper = createWrapper(true);
    const result = wrapper.find('Result');

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('success');
  });

  it('shows error message when import failed', () => {
    const wrapper = createWrapper(false, true);
    const result = wrapper.find('Result');

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('error');
  });

  it('creates server and redirects to it when form is submitted', () => {
    const wrapper = createWrapper();
    const form = wrapper.find(ServerForm);

    form.simulate('submit', {});

    expect(createServerMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
