import { shallow, ShallowWrapper } from 'enzyme';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Mock } from 'ts-mockery';
import { useNavigate } from 'react-router-dom';
import DeleteServerModal from '../../src/servers/DeleteServerModal';
import { ServerWithId } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: jest.fn() }));

describe('<DeleteServerModal />', () => {
  let wrapper: ShallowWrapper;
  const deleteServerMock = jest.fn();
  const navigate = jest.fn();
  const toggleMock = jest.fn();
  const serverName = 'the_server_name';

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);

    wrapper = shallow(
      <DeleteServerModal
        server={Mock.of<ServerWithId>({ name: serverName })}
        toggle={toggleMock}
        isOpen
        deleteServer={deleteServerMock}
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
    const cancelBtn = wrapper.find(Button).first();

    cancelBtn.simulate('click');

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('deletes server when clicking accept button', () => {
    const acceptBtn = wrapper.find(Button).last();

    acceptBtn.simulate('click');

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
