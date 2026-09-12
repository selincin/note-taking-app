export interface NavItem {
  label: string;
  icon: string;
  route: string;
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'All Notes', icon: 'home_filled', route: '/notes' },
  { label: 'Search', icon: 'search', route: '/search', hideOnDesktop: true },
  { label: 'Archived Notes', icon: 'archive', route: '/archived' },
  { label: 'Tags', icon: 'sell', route: '/tags', hideOnDesktop: true },
];