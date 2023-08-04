import { DropdownBtn } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import type { QrErrorCorrection } from '../../../utils/helpers/qrCodes';

interface QrErrorCorrectionDropdownProps {
  errorCorrection: QrErrorCorrection;
  setErrorCorrection: (errorCorrection: QrErrorCorrection) => void;
}

export const QrErrorCorrectionDropdown: FC<QrErrorCorrectionDropdownProps> = (
  { errorCorrection, setErrorCorrection },
) => (
  <DropdownBtn text={`Error correction (${errorCorrection})`}>
    <DropdownItem active={errorCorrection === 'L'} onClick={() => setErrorCorrection('L')}>
      <b>L</b>ow
    </DropdownItem>
    <DropdownItem active={errorCorrection === 'M'} onClick={() => setErrorCorrection('M')}>
      <b>M</b>edium
    </DropdownItem>
    <DropdownItem active={errorCorrection === 'Q'} onClick={() => setErrorCorrection('Q')}>
      <b>Q</b>uartile
    </DropdownItem>
    <DropdownItem active={errorCorrection === 'H'} onClick={() => setErrorCorrection('H')}>
      <b>H</b>igh
    </DropdownItem>
  </DropdownBtn>
);
