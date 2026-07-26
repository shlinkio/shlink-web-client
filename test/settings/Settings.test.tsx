import { MemoryRouter } from 'react-router';
import { Settings } from '../../src/settings/Settings';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<Settings />', () => {
  const setUp = () =>
    renderWithStore(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));
});
