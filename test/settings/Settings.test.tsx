import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { SettingsFactory } from '../../src/settings/Settings';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<Settings />', () => {
  const Settings = SettingsFactory(fromPartial({
    RealTimeUpdatesSettings: () => <span>RealTimeUpdates</span>,
    ShortUrlCreationSettings: () => <span>ShortUrlCreation</span>,
    ShortUrlsListSettings: () => <span>ShortUrlsList</span>,
    UserInterfaceSettings: () => <span>UserInterface</span>,
    VisitsSettings: () => <span>Visits</span>,
    TagsSettings: () => <span>Tags</span>,
  }));
  const setUp = (activeRoute = '/') => {
    const history = createMemoryHistory();
    history.push(activeRoute);
    return render(<Router location={history.location} navigator={history}><Settings /></Router>);
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

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
