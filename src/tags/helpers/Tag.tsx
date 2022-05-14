import { FC, MouseEventHandler, PropsWithChildren } from 'react';
import classNames from 'classnames';
import ColorGenerator from '../../utils/services/ColorGenerator';
import './Tag.scss';

type TagProps = PropsWithChildren<{
  colorGenerator: ColorGenerator;
  text: string;
  className?: string;
  clearable?: boolean;
  onClick?: MouseEventHandler;
  onClose?: MouseEventHandler;
}>;

const Tag: FC<TagProps> = ({ text, children, clearable, className = '', colorGenerator, onClick, onClose }) => (
  <span
    className={classNames('badge tag', className, { 'tag--light-bg': colorGenerator.isColorLightForKey(text) })}
    style={{ backgroundColor: colorGenerator.getColorForKey(text), cursor: clearable || !onClick ? 'auto' : 'pointer' }}
    onClick={onClick}
  >
    {children ?? text}
    {clearable && <span className="close tag__close-selected-tag" onClick={onClose}>&times;</span>}
  </span>
);

export default Tag;
