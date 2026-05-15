/**
 * Mock account data for the /account page. Real billing/profile API is not wired
 * yet; this seeds the UI so design + flow can be validated.
 * TODO: replace with a real `loadAccount(uid)` call (Firebase user + a billing
 * provider) once those are integrated.
 */
export const MOCK_ACCOUNT: Account = {
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
