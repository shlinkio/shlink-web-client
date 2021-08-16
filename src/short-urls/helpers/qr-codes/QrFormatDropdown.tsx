import { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { DropdownBtn } from '../../../utils/DropdownBtn';
import { QrCodeFormat } from '../../../utils/helpers/qrCodes';

interface QrFormatDropdownProps {
  format: QrCodeFormat;
  setFormat: (format: QrCodeFormat) => void;
}

export const QrFormatDropdown: FC<QrFormatDropdownProps> = ({ format, setFormat }) => (
  <DropdownBtn text={`Format (${format})`}>
    <DropdownItem active={format === 'png'} onClick={() => setFormat('png')}>PNG</DropdownItem>
    <DropdownItem active={format === 'svg'} onClick={() => setFormat('svg')}>SVG</DropdownItem>
  </DropdownBtn>
);
