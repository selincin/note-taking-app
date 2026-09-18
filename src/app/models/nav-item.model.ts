export interface NavItem {
  label: string;
  icon: string;
  route: string;
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'NAV.ALL_NOTES', icon: 'home_filled', route: '/notes' },
  { label: 'NAV.SEARCH', icon: 'search', route: '/search', hideOnDesktop: true },
  { label: 'NAV.ARCHIVED_NOTES', icon: 'archive', route: '/archived' },
  { label: 'NAV.TAGS', icon: 'sell', route: '/tags', hideOnDesktop: true },
];