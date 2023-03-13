import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import type { FC } from 'react';
import { useRef } from 'react';
import type { InputProps } from 'reactstrap';
import { Input } from 'reactstrap';
import './IconInput.scss';

type IconInputProps = InputProps & { icon: IconProp };

export const IconInput: FC<IconInputProps> = ({ icon, className, ...rest }) => {
  const ref = useRef<{ input: HTMLInputElement }>();
  const classes = classNames('icon-input-container__input', className);

  return (
    <div className="icon-input-container">
      <Input className={classes} {...rest} />
      <FontAwesomeIcon
        icon={icon}
        fixedWidth
        className="icon-input-container__icon"
        onClick={() => ref.current?.input.focus()}
      />
    </div>
  );
};
