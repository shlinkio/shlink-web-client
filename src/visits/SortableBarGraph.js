import React from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, identity, keys, pipe, prop, reverse, sortBy, toLower, toPairs, type } from 'ramda';
import SortingDropdown from '../utils/SortingDropdown';
import GraphCard from './GraphCard';

const toLowerIfString = (value) => type(value) === 'String' ? toLower(value) : identity(value);

export default class SortableBarGraph extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    sortingItems: PropTypes.object.isRequired,
    extraHeaderContent: PropTypes.arrayOf(PropTypes.func),
  };

  state = {
    orderField: undefined,
    orderDir: undefined,
  };

  render() {
    const { stats, sortingItems, title, extraHeaderContent } = this.props;
    const sortStats = () => {
      if (!this.state.orderField) {
        return stats;
      }

      const sortedPairs = sortBy(
        pipe(
          prop(this.state.orderField === head(keys(sortingItems)) ? 0 : 1),
          toLowerIfString
        ),
        toPairs(stats)
      );

      return fromPairs(this.state.orderDir === 'ASC' ? sortedPairs : reverse(sortedPairs));
    };

    return (
      <GraphCard stats={sortStats()} isBarChart>
        {title}
        <div className="float-right">
          <SortingDropdown
            isButton={false}
            right
            orderField={this.state.orderField}
            orderDir={this.state.orderDir}
            items={sortingItems}
            onChange={(orderField, orderDir) => this.setState({ orderField, orderDir })}
          />
        </div>
        {extraHeaderContent && extraHeaderContent.map((content, index) => (
          <div key={index} className="float-right">
            {content()}
          </div>
        ))}
      </GraphCard>
    );
  }
}
