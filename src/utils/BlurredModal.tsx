import { FC } from 'react';
import { ModalProps, Modal } from 'reactstrap'; // eslint-disable-line import/named
import './BlurredModal.scss';

const onEnter = () => document.body.classList.add('with-modal');
const onExit = () => document.body.classList.remove('with-modal');

export const BlurredModal: FC<ModalProps> = ({ children, ...rest }) => (
  <Modal {...rest} modalTransition={{ onEnter, onExit }}>
    {children}
  </Modal>
);
