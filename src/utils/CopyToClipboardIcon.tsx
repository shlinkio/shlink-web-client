import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import './CopyToClipboardIcon.scss';

interface CopyToClipboardIconProps {
  text: string;
  onCopy?: (text: string, result: boolean) => void;
}

export const CopyToClipboardIcon: FC<CopyToClipboardIconProps> = ({ text, onCopy }) => (
  <CopyToClipboard text={text} onCopy={onCopy}>
    <FontAwesomeIcon icon={copyIcon} className="ms-2 copy-to-clipboard-icon" />
  </CopyToClipboard>
);
