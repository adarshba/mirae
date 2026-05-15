import { browser } from '$app/environment';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { createContext } from 'svelte';
import { auth } from '$utils/firebase';

export class AuthStore {
  user: User | null = $state(null);
  ready: boolean = $state(false);

  constructor() {
    if (!browser) return;
    onAuthStateChanged(auth, (u) => {
      this.user = u;
      this.ready = true;
    });
  }

  async signOut() {
    await signOut(auth);
  }
}

export const [getAuthContext, setAuthContext] = createContext<AuthStore>();
