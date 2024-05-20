import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Settings } from '../../src/settings/Settings';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<Settings />', () => {
  const setUp = () => render(
    <MemoryRouter>
      <Settings settings={{}} setSettings={vi.fn()} />
    </MemoryRouter>,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));
});
