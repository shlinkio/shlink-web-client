import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { Domain } from '../../../src/domains/data';
import { DomainDropdown } from '../../../src/domains/helpers/DomainDropdown';
import type { SelectedServer } from '../../../src/servers/data';
import type { SemVer } from '../../../src/utils/helpers/version';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DomainDropdown />', () => {
  const editDomainRedirects = vi.fn().mockResolvedValue(undefined);
  const setUp = (domain?: Domain, selectedServer?: SelectedServer) => renderWithEvents(
    <MemoryRouter>
      <DomainDropdown
        domain={domain ?? fromPartial({})}
        selectedServer={selectedServer ?? fromPartial({})}
        editDomainRedirects={editDomainRedirects}
      />
    </MemoryRouter>,
  );

  it('renders expected menu items', () => {
    setUp();

    expect(screen.queryByText('Visit stats')).not.toBeInTheDocument();
    expect(screen.getByText('Edit redirects')).toBeInTheDocument();
  });

  it.each([
    [true, '_DEFAULT'],
    [false, ''],
  ])('points first link to the proper section', (isDefault, expectedLink) => {
    setUp(
      fromPartial({ domain: 'foo.com', isDefault }),
      fromPartial({ version: '3.1.0', id: '123' }),
    );

    expect(screen.getByText('Visit stats')).toHaveAttribute('href', `/server/123/domain/foo.com${expectedLink}/visits`);
  });

  it.each([
    [true, '2.9.0' as SemVer, false],
    [true, '2.10.0' as SemVer, true],
    [false, '2.9.0' as SemVer, true],
  ])('allows editing certain the domains', (isDefault, serverVersion, canBeEdited) => {
    setUp(
      fromPartial({ domain: 'foo.com', isDefault }),
      fromPartial({ version: serverVersion, id: '123' }),
    );

    if (canBeEdited) {
      expect(screen.getByText('Edit redirects')).not.toHaveAttribute('disabled');
    } else {
      expect(screen.getByText('Edit redirects')).toHaveAttribute('disabled');
    }
  });

  it.each([
    ['foo.com'],
    ['bar.org'],
    ['baz.net'],
  ])('displays modal when editing redirects', async (domain) => {
    const { user } = setUp(fromPartial({ domain, isDefault: false }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    await user.click(screen.getByText('Edit redirects'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(editDomainRedirects).not.toHaveBeenCalled();
    await user.click(screen.getByText('Save'));
    expect(editDomainRedirects).toHaveBeenCalledWith(expect.objectContaining({ domain }));

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('displays dropdown when clicked', async () => {
    const { user } = setUp();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { expanded: false }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });
});
