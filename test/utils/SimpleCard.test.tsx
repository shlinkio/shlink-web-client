import { render, screen } from '@testing-library/react';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<SimpleCard />', () => {
  it('does not render title if not provided', () => {
    render(<SimpleCard />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders provided title', () => {
    render(<SimpleCard title="Cool title" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Cool title');
  });

  it('renders children inside body', () => {
    render(<SimpleCard>Hello world</SimpleCard>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it.each(['primary', 'danger', 'warning'])('passes extra props to nested card', (color) => {
    const { container } = render(<SimpleCard className="foo" color={color}>Hello world</SimpleCard>);
    expect(container.firstChild).toHaveAttribute('class', `foo card bg-${color}`);
  });
});
