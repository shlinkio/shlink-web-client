import { FC } from 'react';
import { Card, Row } from 'reactstrap';
import classNames from 'classnames';
import { faCircleNotch as preloader } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type MessageType = 'default' | 'error';

const getClassForType = (type: MessageType) => {
  const map: Record<MessageType, string> = {
    error: 'border-danger',
    default: '',
  };

  return map[type];
};
const getTextClassForType = (type: MessageType) => {
  const map: Record<MessageType, string> = {
    error: 'text-danger',
    default: 'text-muted',
  };

  return map[type];
};

export interface MessageProps {
  className?: string;
  loading?: boolean;
  fullWidth?: boolean;
  type?: MessageType;
}

const Message: FC<MessageProps> = ({ className, children, loading = false, type = 'default', fullWidth = false }) => {
  const classes = classNames({
    'col-md-12': fullWidth,
    'col-md-10 offset-md-1': !fullWidth,
  });

  return (
    <Row noGutters className={className}>
      <div className={classes}>
        <Card className={getClassForType(type)} body>
          <h3 className={classNames('text-center mb-0', getTextClassForType(type))}>
            {loading && <FontAwesomeIcon icon={preloader} spin />}
            {loading && <span className="ms-2">{children ?? 'Loading...'}</span>}
            {!loading && children}
          </h3>
        </Card>
      </div>
    </Row>
  );
};

export default Message;
