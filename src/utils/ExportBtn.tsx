import { FC } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { prettify } from './helpers/numbers';

interface ExportBtnProps {
  onClick: () => void;
  amount?: number;
  className?: string;
}

export const ExportBtn: FC<ExportBtnProps> = ({ onClick, className, amount = 0 }) => (
  <Button outline color="primary" className={className} onClick={onClick}>
    <FontAwesomeIcon icon={faFileDownload} /> Export ({prettify(amount)})
  </Button>
);
