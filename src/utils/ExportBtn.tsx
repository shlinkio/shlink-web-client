import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import type { ButtonProps } from 'reactstrap';
import { Button } from 'reactstrap';
import { prettify } from './helpers/numbers';

interface ExportBtnProps extends Omit<ButtonProps, 'outline' | 'color' | 'disabled'> {
  amount?: number;
  loading?: boolean;
}

export const ExportBtn: FC<ExportBtnProps> = ({ amount = 0, loading = false, ...rest }) => (
  <Button {...rest} outline color="primary" disabled={loading}>
    <FontAwesomeIcon icon={faFileCsv} /> {loading ? 'Exporting...' : <>Export ({prettify(amount)})</>}
  </Button>
);
