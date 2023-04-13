import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { formatISO } from 'date-fns';
import { MemoryRouter } from 'react-router-dom';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { DomainVisits as createDomainVisits } from '../../src/visits/DomainVisits';
import type { DomainVisits } from '../../src/visits/reducers/domainVisits';
import { renderWithEvents } from '../__helpers__/setUpTest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ domain: 'foo.com_DEFAULT' }),
}));

describe('<DomainVisits />', () => {
  const exportVisits = jest.fn();
  const getDomainVisits = jest.fn();
  const cancelGetDomainVisits = jest.fn();
  const domainVisits = fromPartial<DomainVisits>({ visits: [{ date: formatISO(new Date()) }] });
  const DomainVisits = createDomainVisits(fromPartial({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <DomainVisits
        {...fromPartial<MercureBoundProps>({ mercureInfo: {} })}
        getDomainVisits={getDomainVisits}
        cancelGetDomainVisits={cancelGetDomainVisits}
        domainVisits={domainVisits}
        settings={fromPartial({})}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getByRole('heading', { name: '"foo.com" visits' })).toBeInTheDocument();
    expect(getDomainVisits).toHaveBeenCalledWith(expect.objectContaining({ domain: 'DEFAULT' }));
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('domain_foo.com_visits.csv', expect.anything());
  });
});
