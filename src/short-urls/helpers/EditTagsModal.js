import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TagsSelector from '../../utils/TagsSelector';

export default class EditTagsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: props.shortUrl.tags };
  }

  render() {
    const { isOpen, toggle, url } = this.props;
    const changeTags = tags => this.setState({ tags });

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Edit tags for <a target="_blank" href={url}>{url}</a></ModalHeader>
        <ModalBody>
          <TagsSelector tags={this.state.tags} onChange={changeTags} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-primary" type="button">Save</button>
        </ModalFooter>
      </Modal>
    );
  }
}
