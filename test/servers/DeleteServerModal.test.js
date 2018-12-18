import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DeleteServerModal from '../../src/servers/DeleteServerModal';

describe('<DeleteServerModal />', () => {
  let wrapper;
  const deleteServerMock = sinon.fake();
  const historyMock = { push: sinon.fake() };
  const toggleMock = sinon.fake();
  const serverName = 'the_server_name';

  beforeEach(() => {
    toggleMock.resetHistory();
    deleteServerMock.resetHistory();
    historyMock.push.resetHistory();

    wrapper = shallow(
      <DeleteServerModal
        server={{ name: serverName }}
        toggle={toggleMock}
        isOpen={true}
        deleteServer={deleteServerMock}
        history={historyMock}
      />
    );
  });
  afterEach(() => wrapper.unmount());

  it('renders a modal window', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(wrapper.find(ModalHeader)).toHaveLength(1);
    expect(wrapper.find(ModalBody)).toHaveLength(1);
    expect(wrapper.find(ModalFooter)).toHaveLength(1);
  });

  it('displays the name of the server as part of the content', () => {
    const modalBody = wrapper.find(ModalBody);

    expect(modalBody.find('p').first().text()).toEqual(
      `Are you sure you want to delete server ${serverName}?`
    );
  });

  it('toggles when clicking cancel button', () => {
    const cancelBtn = wrapper.find('button').first();

    cancelBtn.simulate('click');

    expect(toggleMock.callCount).toEqual(1);
    expect(deleteServerMock.callCount).toEqual(0);
    expect(historyMock.push.callCount).toEqual(0);
  });

  it('deletes server when clicking accept button', () => {
    const acceptBtn = wrapper.find('button').last();

    acceptBtn.simulate('click');

    expect(toggleMock.callCount).toEqual(1);
    expect(deleteServerMock.callCount).toEqual(1);
    expect(historyMock.push.callCount).toEqual(1);
  });
});
