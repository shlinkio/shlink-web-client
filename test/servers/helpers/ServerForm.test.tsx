import { fireEvent, render, screen } from '@testing-library/react';
import { ServerForm } from '../../../src/servers/helpers/ServerForm';

describe('<ServerForm />', () => {
  const onSubmit = jest.fn();
  const setUp = () => render(<ServerForm onSubmit={onSubmit}>Something</ServerForm>);

  afterEach(jest.resetAllMocks);

  it('renders components', () => {
    setUp();

    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(screen.getByText('Something')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    setUp();

    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole('form'), { preventDefault: jest.fn() });
    expect(onSubmit).toHaveBeenCalled();
  });
});
