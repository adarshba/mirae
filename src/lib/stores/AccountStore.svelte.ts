import { createContext } from 'svelte';

const MOCK_ACCOUNT: Account = {
  phoneMasked: '+82 10 ••• 4827',
  paymentMethod: 'Toss Card ending 8821',
  nextBilling: 'June 4',
  plan: 'premium',
  planPrice: '₩17,000',
  memberSince: 'March 2024',
  devices: [
    {
      id: 'apple-tv',
      kind: 'tv',
      label: 'Living Room · Apple TV 4K',
      status: 'Active now · Seoul · Casting Queen of Tears'
    },
    {
      id: 'iphone',
      kind: 'phone',
      label: 'iPhone 15 Pro',
      status: 'Last active 14m ago · Seoul'
    },
    {
      id: 'macbook',
      kind: 'laptop',
      label: 'MacBook Pro 14"',
      status: 'Last active yesterday'
    }
  ]
};

export class AccountStore {
  account: Account = $state(MOCK_ACCOUNT);
}

export const [getAccountContext, setAccountContext] = createContext<AccountStore>();
