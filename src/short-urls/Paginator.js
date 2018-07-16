import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { connect } from 'react-redux';
import { updateShortUrlsList } from './reducers/shortUrlsList';

export class Paginator extends React.Component {
  render() {
    const { paginator = {}, serverId } = this.props;
    const { currentPage, pagesCount = 0 } = paginator;
    if (pagesCount <= 1) {
      return null;
    }

    const renderPages = () => {
      const pages = [];

      for (let i = 1; i <= pagesCount; i++) {
        pages.push(
          <PaginationItem key={i} active={currentPage === i}>
            <PaginationLink
              tag={Link}
              to={`/server/${serverId}/list-short-urls/${i}`}
              onClick={() => this.updatePage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return pages;
    };

    return (
      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            tag={Link}
            to={`/server/${serverId}/list-short-urls/${currentPage - 1}`}
            onClick={() => this.updatePage(currentPage - 1)}
          />
        </PaginationItem>
        {renderPages()}
        <PaginationItem disabled={currentPage >= pagesCount}>
          <PaginationLink
            next
            tag={Link}
            to={`/server/${serverId}/list-short-urls/${currentPage + 1}`}
            onClick={() => this.updatePage(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>
    );
  }

  updatePage(page) {
    this.props.updateShortUrlsList({ ...this.props.shortUrlsListParams, page })
  }
}

export default connect(state => ({
  shortUrlsListParams: state.shortUrlsListParams,
}), { updateShortUrlsList })(Paginator);
