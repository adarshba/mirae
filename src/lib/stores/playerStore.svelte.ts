import { getContext, setContext } from 'svelte';

export type MenuKey = 'speed' | 'subs' | 'episodes' | null;

const UP_NEXT_LEAD_SECONDS = 15;

export class PlayerState {
  paused = $state(true);
  currentTime = $state(0);
  duration = $state(0);
  buffered = $state(0);
  volume = $state(1);
  muted = $state(true);
  playbackRate = $state(1);

  controlsVisible = $state(true);
  menuOpen = $state<MenuKey>(null);

  showTitle = $state('');
  episodeTitle = $state('');

  progress = $derived(this.duration ? this.currentTime / this.duration : 0);

  nearEnd = $derived(
    this.duration > 0 && this.duration - this.currentTime <= UP_NEXT_LEAD_SECONDS && !this.paused
  );
  upNextCountdown = $derived(Math.max(0, Math.ceil(this.duration - this.currentTime)));
}

const KEY = Symbol('player');

export const setPlayerContext = (store: PlayerState) => setContext(KEY, store);
export const getPlayerContext = () => getContext<PlayerState>(KEY);
