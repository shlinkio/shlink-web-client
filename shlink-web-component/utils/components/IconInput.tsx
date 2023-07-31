import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import type { FC } from 'react';
import type { InputProps } from 'reactstrap';
import { Input } from 'reactstrap';
import { useElementRef } from '../../../shlink-frontend-kit/src';
import './IconInput.scss';

type IconInputProps = InputProps & {
  icon: IconProp;
};

export const IconInput: FC<IconInputProps> = ({ icon, className, ...rest }) => {
  const ref = useElementRef<HTMLInputElement>();
  const classes = classNames('icon-input-container__input', className);

  return (
    <div className="icon-input-container">
      <Input className={classes} innerRef={ref} {...rest} />
      <FontAwesomeIcon
        icon={icon}
        fixedWidth
        className="icon-input-container__icon"
        onClick={() => ref.current?.focus()}
      />
    </div>
  );
};
