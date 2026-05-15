import { createContext } from 'svelte';
import { MOCK_ACCOUNT } from '$lib/fixtures/account';

export class AccountStore {
  account: Account = $state(MOCK_ACCOUNT);
}

export const [getAccountContext, setAccountContext] = createContext<AccountStore>();
