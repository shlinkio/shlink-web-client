import React from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, keys, prop, reverse, sortBy, toPairs } from 'ramda';
import SortingDropdown from '../utils/SortingDropdown';
import GraphCard from './GraphCard';

export default class SortableBarGraph extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    sortingItems: PropTypes.object.isRequired,
  };

  state = {
    orderField: undefined,
    orderDir: undefined,
  };

  render() {
    const { stats, sortingItems, title } = this.props;
    const sortStats = () => {
      if (!this.state.orderField) {
        return stats;
      }

      const sortedPairs = sortBy(prop(this.state.orderField === head(keys(sortingItems)) ? 0 : 1), toPairs(stats));

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
      </GraphCard>
    );
  }
}
