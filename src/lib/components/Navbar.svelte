<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import { scrollY } from 'svelte/reactivity/window';
  import Search from '@lucide/svelte/icons/search';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  import { goto } from '$app/navigation';
  import { getAuthContext } from '$stores/authStore.svelte';
  import Avatar from '$components/profile/Avatar.svelte';
  import ProfileDropdown from '$components/profile/ProfileDropdown.svelte';
  import { NAVBAR_STICKY_SCROLL_PX } from '$lib/constants/timing.constants';

  let isSearchActive = $state(false);
  let isMenuOpen = $state(false);
  let isProfileOpen = $state(false);
  let searchQuery = $state('');
  let searchInputEl = $state<HTMLInputElement | null>(null);
  let profileChipEl = $state<HTMLDivElement | null>(null);

  const authStore = getAuthContext();

  const isSticky = $derived((scrollY.current ?? 0) > NAVBAR_STICKY_SCROLL_PX);

  type NavItem = { name: string; href: string };
  const navItems = $derived<NavItem[]>(
    authStore.user ? [{ name: 'My List', href: '/my-list' }] : []
  );

  const activateSearch = () => {
    isSearchActive = true;
    queueMicrotask(() => searchInputEl?.focus());
  };

  const deactivateSearch = () => {
    if (!searchQuery) isSearchActive = false;
  };

  const submitSearch = async (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      searchQuery = '';
      isSearchActive = false;
      return;
    }
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    await goto(`/search?query=${encodeURIComponent(query)}`);
    isSearchActive = false;
    searchQuery = '';
  };

  const toggleMenu = () => (isMenuOpen = !isMenuOpen);
  const closeMenu = () => (isMenuOpen = false);
  const toggleProfile = () => (isProfileOpen = !isProfileOpen);
  const closeProfile = () => (isProfileOpen = false);

  const handleDocumentClick = (e: MouseEvent) => {
    if (!isProfileOpen) return;
    if (profileChipEl && !profileChipEl.contains(e.target as Node)) {
      isProfileOpen = false;
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') isProfileOpen = false;
  };

  const iconBtn =
    'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[color:var(--text-primary)] transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:bg-white/[0.08]';
</script>

<svelte:window onclick={handleDocumentClick} onkeydown={handleKeydown} />

<header
  class="fixed top-0 right-0 left-0 z-[50] flex flex-col px-5 py-[1.125rem] text-[color:var(--text-primary)] transition-[background-color,backdrop-filter] duration-[220ms] ease-[ease] md:px-10 md:py-3 {isSticky
    ? 'border-b border-white/[0.06] bg-[rgba(10,10,11,0.92)] backdrop-blur-[10px] backdrop-saturate-[150%] md:py-2'
    : 'bg-[image:linear-gradient(180deg,rgba(10,10,11,0.75)_0%,transparent_100%)]'}"
>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-6">
      <a href="/" aria-label="Mirae home" class="block">
        <img src={logo} alt="Mirae" class="block h-auto w-[8rem]" />
      </a>

      <nav class="hidden gap-5 md:flex">
        {#each navItems as item (item.name)}
          <a
            href={item.href}
            class="relative cursor-pointer text-[0.875rem] font-medium tracking-[-0.005em] text-white no-underline transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:underline"
          >
            {item.name}
          </a>
        {/each}
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <div
        class="relative hidden h-9 items-center overflow-hidden rounded-md border bg-transparent transition-[width,background-color,border-color] duration-(--duration-base,300ms) ease-(--ease-standard) md:flex {isSearchActive
          ? 'w-[17.5rem] border-white/25 bg-black/70'
          : 'w-9 border-transparent hover:bg-white/[0.08]'}"
      >
        <button
          type="button"
          aria-label="Search"
          onclick={activateSearch}
          class="inline-flex h-9 w-9 flex-none cursor-pointer items-center justify-center border-0 bg-transparent text-[color:var(--text-primary)]"
        >
          <Search size={18} />
        </button>
        <input
          bind:this={searchInputEl}
          bind:value={searchQuery}
          placeholder="Titles, genres, actors"
          aria-label="Search Mirae"
          type="text"
          onkeydown={submitSearch}
          onblur={deactivateSearch}
          class="h-full min-w-0 flex-1 border-0 bg-transparent pr-3 text-[0.875rem] text-[color:var(--text-primary)] transition-opacity duration-(--duration-base,300ms) ease-(--ease-standard) outline-none placeholder:text-[color:var(--muted-foreground)] {isSearchActive
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'}"
        />
      </div>

      {#if authStore.user}
        <div class="relative hidden md:inline-block" bind:this={profileChipEl}>
          <button
            type="button"
            aria-label="Profile menu"
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            onclick={toggleProfile}
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent py-1 pr-2 pl-1 text-[color:var(--text-primary)] transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:bg-white/[0.06]"
          >
            <Avatar
              name={authStore.user?.displayName}
              email={authStore.user?.email}
              seed={authStore.user?.uid}
              size={30}
            />
            <ChevronDown size={14} class="opacity-75" />
          </button>
          {#if isProfileOpen}
            <ProfileDropdown onClose={closeProfile} />
          {/if}
        </div>
      {:else}
        <a
          href="/login"
          class="bg-brand hidden cursor-pointer rounded-md px-4 py-1.5 text-[0.9375rem] font-semibold text-white no-underline transition-opacity duration-(--duration-fast,150ms) ease-(--ease-standard) hover:opacity-90 md:inline-flex"
        >
          Sign In
        </a>
      {/if}

      <button
        type="button"
        aria-label="Open menu"
        onclick={toggleMenu}
        class="inline-flex h-9 w-9 cursor-pointer items-center justify-center border-0 bg-transparent text-[color:var(--text-primary)] md:hidden"
      >
        <Menu size={20} />
      </button>
    </div>
  </div>

  <div
    class="border-line fixed top-0 right-0 left-0 z-[49] border-b bg-[rgba(10,10,11,0.96)] px-5 py-4 backdrop-blur-[20px] transition-transform duration-(--duration-base,300ms) ease-(--ease-standard) {isMenuOpen
      ? 'translate-y-0'
      : '-translate-y-full'}"
  >
    <div class="mb-5 flex items-center justify-between">
      <img src={logo} alt="Mirae" class="h-auto w-24" />
      <button type="button" aria-label="Close menu" onclick={closeMenu} class={iconBtn}>
        <X size={20} />
      </button>
    </div>
    <nav class="flex flex-col gap-3">
      {#each navItems as item (item.name)}
        <a
          href={item.href}
          onclick={closeMenu}
          class="py-2 text-[1.125rem] font-semibold text-[color:var(--text-primary)]"
        >
          {item.name}
        </a>
      {/each}
    </nav>
  </div>

  {#if isMenuOpen}
    <button
      type="button"
      aria-label="Close menu"
      onclick={closeMenu}
      class="fixed inset-0 z-[48] cursor-pointer border-0 bg-[color:var(--bg-overlay-scrim)]"
    ></button>
  {/if}
</header>
