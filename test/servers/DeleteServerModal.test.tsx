import { shallow, ShallowWrapper } from 'enzyme';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { History } from 'history';
import { Mock } from 'ts-mockery';
import DeleteServerModal from '../../src/servers/DeleteServerModal';
import { ServerWithId } from '../../src/servers/data';

describe('<DeleteServerModal />', () => {
  let wrapper: ShallowWrapper;
  const deleteServerMock = jest.fn();
  const push = jest.fn();
  const toggleMock = jest.fn();
  const serverName = 'the_server_name';

  beforeEach(() => {
    wrapper = shallow(
      <DeleteServerModal
        server={Mock.of<ServerWithId>({ name: serverName })}
        toggle={toggleMock}
        isOpen={true}
        deleteServer={deleteServerMock}
        history={Mock.of<History>({ push })}
      />,
    );
  });
  afterEach(() => wrapper.unmount());
  afterEach(jest.clearAllMocks);

  it('renders a modal window', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(ModalHeader)).toHaveLength(1);
    expect(wrapper.find(ModalBody)).toHaveLength(1);
    expect(wrapper.find(ModalFooter)).toHaveLength(1);
  });

  it('displays the name of the server as part of the content', () => {
    const modalBody = wrapper.find(ModalBody);

    expect(modalBody.find('p').first().text()).toEqual(
      `Are you sure you want to remove ${serverName}?`,
    );
  });

  it('toggles when clicking cancel button', () => {
    const cancelBtn = wrapper.find('button').first();

    cancelBtn.simulate('click');

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('deletes server when clicking accept button', () => {
    const acceptBtn = wrapper.find('button').last();

    acceptBtn.simulate('click');

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
