import { DoughnutChart } from '../../../src/visits/charts/DoughnutChart';
import { setUpCanvas } from '../../__mocks__/setUpCanvas';
import { screen } from '@testing-library/react';

describe('<DoughnutChart />', () => {
  const stats = {
    foo: 123,
    bar: 456,
  };

  it('renders Doughnut with expected props', () => {
    const { events } = setUpCanvas(<DoughnutChart stats={stats} />);

    expect(events).toBeTruthy();
    expect(events).toMatchSnapshot();
  });

  it('renders expected legend', () => {
    setUpCanvas(<DoughnutChart stats={stats} />);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
  })
});
