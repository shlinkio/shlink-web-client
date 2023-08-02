import { render, screen } from '@testing-library/react';
import type { SimpleCardProps } from '../../src';
import { SimpleCard } from '../../src';

const setUp = ({ children, ...rest }: SimpleCardProps = {}) => render(<SimpleCard {...rest}>{children}</SimpleCard>);

describe('<SimpleCard />', () => {
  it('does not render title if not provided', () => {
    setUp();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders provided title', () => {
    setUp({ title: 'Cool title' });
    expect(screen.getByRole('heading')).toHaveTextContent('Cool title');
  });

  it('renders children inside body', () => {
    setUp({ children: 'Hello world' });
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it.each(['primary', 'danger', 'warning'])('passes extra props to nested card', (color) => {
    const { container } = setUp({ className: 'foo', color, children: 'Hello world' });
    expect(container.firstChild).toHaveAttribute('class', `foo card bg-${color}`);
  });
});
