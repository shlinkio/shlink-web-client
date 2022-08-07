import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Settings as createSettings } from '../../src/settings/Settings';

describe('<Settings />', () => {
  const Settings = createSettings(
    () => <span>RealTimeUpdates</span>,
    () => <span>ShortUrlCreation</span>,
    () => <span>ShortUrlsList</span>,
    () => <span>UserInterface</span>,
    () => <span>Visits</span>,
    () => <span>Tags</span>,
  );
  const setUp = (activeRoute = '/') => {
    const history = createMemoryHistory();
    history.push(activeRoute);
    return render(<Router location={history.location} navigator={history}><Settings /></Router>);
  };

  it.each([
    ['/general', {
      visibleComps: ['UserInterface', 'RealTimeUpdates'],
      hiddenComps: ['ShortUrlCreation', 'ShortUrlsList', 'Tags', 'Visits'],
    }],
    ['/short-urls', {
      visibleComps: ['ShortUrlCreation', 'ShortUrlsList'],
      hiddenComps: ['UserInterface', 'RealTimeUpdates', 'Tags', 'Visits'],
    }],
    ['/other-items', {
      visibleComps: ['Tags', 'Visits'],
      hiddenComps: ['UserInterface', 'RealTimeUpdates', 'ShortUrlCreation', 'ShortUrlsList'],
    }],
  ])('renders expected sections based on route', (activeRoute, { visibleComps, hiddenComps }) => {
    setUp(activeRoute);

    visibleComps.forEach((comp) => expect(screen.getByText(comp)).toBeInTheDocument());
    hiddenComps.forEach((comp) => expect(screen.queryByText(comp)).not.toBeInTheDocument());
  });

  it('renders expected menu', () => {
    setUp();

    expect(screen.getByRole('link', { name: 'General' })).toHaveAttribute('href', '/general');
    expect(screen.getByRole('link', { name: 'Short URLs' })).toHaveAttribute('href', '/short-urls');
    expect(screen.getByRole('link', { name: 'Other items' })).toHaveAttribute('href', '/other-items');
  });
});
