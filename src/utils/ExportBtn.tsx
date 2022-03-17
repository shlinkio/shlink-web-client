import { FC } from 'react';
import { Button, ButtonProps } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { prettify } from './helpers/numbers';

interface ExportBtnProps extends Omit<ButtonProps, 'outline' | 'color' | 'disabled'> {
  amount?: number;
  loading?: boolean;
}

export const ExportBtn: FC<ExportBtnProps> = ({ amount = 0, loading = false, ...rest }) => (
  <Button {...rest} outline color="primary" disabled={loading}>
    <FontAwesomeIcon icon={faFileDownload} /> {loading ? 'Exporting...' : <>Export ({prettify(amount)})</>}
  </Button>
);
