import { FC } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight as chevronIcon } from '@fortawesome/free-solid-svg-icons';
import { ServerWithId } from './data';
import './ServersListGroup.scss';

interface ServersListGroup {
  servers: ServerWithId[];
}

const ServerListItem = ({ id, name }: { id: string; name: string }) => (
  <ListGroupItem tag={Link} to={`/server/${id}`} className="servers-list__server-item">
    {name}
    <FontAwesomeIcon icon={chevronIcon} className="servers-list__server-item-icon" />
  </ListGroupItem>
);

const ServersListGroup: FC<ServersListGroup> = ({ servers, children }) => (
  <>
    <div className="container">
      <h5>{children}</h5>
    </div>
    {servers.length > 0 && (
      <ListGroup className="servers-list__list-group mt-md-3">
        {servers.map(({ id, name }) => <ServerListItem key={id} id={id} name={name} />)}
      </ListGroup>
    )}
  </>
);

export default ServersListGroup;
