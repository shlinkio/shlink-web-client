import { faMinusCircle as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const DeleteServerButton = (DeleteServerModal) => class DeleteServerButton extends React.Component {
  static propTypes = {
    server: serverType,
    className: PropTypes.string,
  };

  state = { isModalOpen: false };

  render() {
    const { server, className } = this.props;

    return (
      <React.Fragment>
        <span
          className={className}
          key="deleteServerBtn"
          onClick={() => this.setState({ isModalOpen: true })}
        >
          <FontAwesomeIcon icon={deleteIcon} />
          <span className="aside-menu__item-text">Delete this server</span>
        </span>

        <DeleteServerModal
          isOpen={this.state.isModalOpen}
          toggle={() => this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }))}
          server={server}
          key="deleteServerModal"
        />
      </React.Fragment>
    );
  }
};

export default DeleteServerButton;
