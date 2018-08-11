import chevronIcon from '@fortawesome/fontawesome-free-solid/faChevronRight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { isEmpty, pick, values } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { resetSelectedServer } from '../servers/reducers/selectedServer'
import './Home.scss'

export class Home extends React.Component {
  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    const servers = values(this.props.servers);
    const hasServers = !isEmpty(servers);

    return (
      <div className="home-container">
        <h1 className="home-container__title">Welcome to Shlink</h1>
        <h5 className="home-container__intro">
          {hasServers && <span>Please, select a server.</span>}
          {!hasServers && <span>Please, <Link to="/server/create">add a server</Link>.</span>}
        </h5>

        {hasServers && (
          <ListGroup className="home-container__servers-list">
            {servers.map(({ name, id }) => (
              <ListGroupItem tag={Link} to={`/server/${id}/list-short-urls/1`} className="home-container__servers-item">
                {name}
                <FontAwesomeIcon icon={chevronIcon} className="home-container__servers-item-icon" />
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }
}

export default connect(pick(['servers']), { resetSelectedServer })(Home);
