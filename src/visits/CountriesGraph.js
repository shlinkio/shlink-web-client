import React from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, keys, prop, reverse, sortBy, toPairs } from 'ramda';
import SortingDropdown from '../utils/SortingDropdown';
import GraphCard from './GraphCard';

export default class CountriesGraph extends React.Component {
  static propTypes = {
    stats: PropTypes.any,
  };

  state = {
    orderField: undefined,
    orderDir: undefined,
  };

  render() {
    const items = {
      name: 'Country name',
      amount: 'Visits amount',
    };
    const { stats } = this.props;
    const sortStats = () => {
      if (!this.state.orderField) {
        return stats;
      }

      const sortedPairs = sortBy(prop(this.state.orderField === head(keys(items)) ? 0 : 1), toPairs(stats));

      return fromPairs(this.state.orderDir === 'ASC' ? sortedPairs : reverse(sortedPairs));
    };

    return (
      <GraphCard stats={sortStats()} isBarChart>
        Countries
        <div className="float-right">
          <SortingDropdown
            isButton={false}
            right
            orderField={this.state.orderField}
            orderDir={this.state.orderDir}
            items={items}
            onChange={(orderField, orderDir) => this.setState({ orderField, orderDir })}
          />
        </div>
      </GraphCard>
    );
  }
}
