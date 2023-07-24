import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import { EditShortUrl as createEditShortUrl } from '../../shlink-web-component/short-urls/EditShortUrl';
import type { ShortUrlDetail } from '../../shlink-web-component/short-urls/reducers/shortUrlDetail';
import type { ShortUrlEdition } from '../../shlink-web-component/short-urls/reducers/shortUrlEdition';

describe('<EditShortUrl />', () => {
  const shortUrlCreation = { validateUrls: true };
  const EditShortUrl = createEditShortUrl(() => <span>ShortUrlForm</span>);
  const setUp = (detail: Partial<ShortUrlDetail> = {}, edition: Partial<ShortUrlEdition> = {}) => render(
    <MemoryRouter>
      <EditShortUrl
        settings={fromPartial({ shortUrlCreation })}
        selectedServer={null}
        shortUrlDetail={fromPartial(detail)}
        shortUrlEdition={fromPartial(edition)}
        getShortUrlDetail={vi.fn()}
        editShortUrl={vi.fn(async () => Promise.resolve())}
      />
    </MemoryRouter>,
  );

  it('renders loading message while loading detail', () => {
    setUp({ loading: true });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('ShortUrlForm')).not.toBeInTheDocument();
  });

  it('renders error when loading detail fails', () => {
    setUp({ error: true });

    expect(screen.getByText('An error occurred while loading short URL detail :(')).toBeInTheDocument();
    expect(screen.queryByText('ShortUrlForm')).not.toBeInTheDocument();
  });

  it('renders form when detail properly loads', () => {
    setUp({ shortUrl: fromPartial({ meta: {} }) });

    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('An error occurred while loading short URL detail :(')).not.toBeInTheDocument();
  });

  it('shows error when saving data has failed', () => {
    setUp({}, { error: true, saved: true });

    expect(screen.getByText('An error occurred while updating short URL :(')).toBeInTheDocument();
    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
  });

  it('shows message when saving data succeeds', () => {
    setUp({}, { error: false, saved: true });

    expect(screen.getByText('Short URL properly edited.')).toBeInTheDocument();
    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
  });
});
