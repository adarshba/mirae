<script lang="ts">
  import logo from '$lib/assets/Netflix-LOGO.png';
  import profileImage from '$lib/assets/profile.jpg';
  import { scrollY } from 'svelte/reactivity/window';
  import Search from '@lucide/svelte/icons/search';
  import Bell from '@lucide/svelte/icons/bell';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  // import { Search, Bell, ChevronRight, Menu, X } from '@lucide/svelte'; (slow imports)
  import { goto } from '$app/navigation';

  let isSearchActive: boolean = $state(false);
  let isMenuOpen: boolean = $state(false);

  const isSticky: boolean = $derived((scrollY.current ?? 0) > 50);

  let searchQuery = $state('');

  const toggleSearch = (e: MouseEvent) => {
    e.stopPropagation();
    isSearchActive = !isSearchActive;
  };

  const handleSearch = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.trim();

      if (query === '') return;

      await goto(`/search?query=${encodeURIComponent(query)}`);

      isSearchActive = false;
      searchQuery = '';
    }
  };

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  const closeMenu = () => {
    isMenuOpen = false;
  };

  const NavItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Tv Shows', href: '/' },
    { name: 'Movies', href: '/' },
    { name: 'New and Popular', href: '/' },
    { name: 'My List', href: '/myList' },
    { name: 'Browse By Languages', href: '/' }
  ];

  type NavItem = {
    name: string;
    href: string;
  };
  type MobileVerParam = {
    mobile?: boolean;
  };
</script>

<header
  class={[
    'fixed top-0 right-0 left-0 z-50 flex flex-col px-5 text-white transition-all duration-300 ease-in-out md:px-10',
    {
      'bg-black shadow-lg': isSticky,
      'bg-linear-to-b from-[rgba(0,0,0,0.7)] to-transparent': !isSticky
    }
  ]}
>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-x-6 md:gap-x-8">
      <a href="/">
        <img src={logo} alt="Netflix Logo" class="w-28" />
      </a>
      {@render Navbar()}
    </div>

    <div class="flex items-center space-x-4">
      {@render searchInput()}
      <Bell size={20} color="white" />
      <img src={profileImage} class="h-8 w-8 cursor-pointer rounded" alt="Profile" />
      <ChevronRight size={24} color="white" />

      <button
        id="ham-button"
        class="ml-4 focus:outline-none md:hidden"
        aria-label="hamburger-button"
        onclick={toggleMenu}
      >
        <Menu size={20} color="white" />
      </button>
    </div>
  </div>

  <div
    id="mobile-menu"
    class={['mobile-menu relative lg:hidden', { open: isMenuOpen }]}
    role="presentation"
  >
    <button class="absolute right-4" onclick={closeMenu}>
      <X size={24} color="white" />
    </button>

    <!-- COPY PASTE DE SEARCH INPUT -->
    {@render searchInput({ mobile: true })}
    {@render Navbar({ mobile: true })}
  </div>

  {#if isMenuOpen}
    <div class="overlay show" onclick={closeMenu} role="presentation"></div>
  {/if}
</header>

{#snippet Navbar({ mobile }: { mobile: boolean } = { mobile: false })}
  {#if mobile}
    <nav class="space-x-4 text-sm md:hidden">
      {#each NavItems as item}
        <a href={item.href} class="hover:text-gray-300">{item.name}</a>
      {/each}
    </nav>
  {:else}
    <nav class="hidden space-x-4 text-sm md:flex">
      {#each NavItems as item}
        <a href={item.href} class="hover:text-gray-300">{item.name}</a>
      {/each}
    </nav>
  {/if}
{/snippet}

{#snippet searchInput({ mobile }: { mobile: boolean } = { mobile: false })}
  {#if mobile}
    <div
      id="search-bar"
      class={['search-container', { active: isSearchActive }]}
      role="presentation"
      onclick={toggleSearch}
    >
      <button class="search-button" aria-label="Toggle Search" onclick={toggleSearch}>
        <Search size={20} color="white" />
      </button>
      <input
        bind:value={searchQuery}
        placeholder="Search"
        aria-label="Search"
        type="text"
        name=""
        id=""
        class="search-input"
        onkeydown={handleSearch}
      />
    </div>
  {:else}
    <div
      id="search-bar"
      class={['search-container hidden md:flex', { active: isSearchActive }]}
      role="presentation"
      onclick={toggleSearch}
    >
      <button class="search-button" aria-label="Toggle Search" onclick={toggleSearch}>
        <Search size={20} color="white" />
      </button>
      <input
        bind:value={searchQuery}
        placeholder="Seach"
        aria-label="Search"
        type="text"
        name=""
        id=""
        class="search-input"
        onkeydown={handleSearch}
      />
    </div>
  {/if}
{/snippet}

<style>
  .search-container {
    position: relative;
    align-items: center;
    transition:
      width 0.3s ease-in-out,
      background-color 0.3s ease-in-out;
    overflow: hidden;
    width: 40px;
  }

  .search-container.active {
    width: 200px;
    border: 1px solid white;
    background-color: black;
  }

  .search-input {
    padding-left: 2rem;
    flex: 1;
    padding-block: 0.5rem;
    background: transparent;
    border: none;
    outline: none;
    opacity: 0;
    color: white;
    transition: opacity 0.3s ease-in-out;
  }

  .search-container.active .search-input {
    opacity: 1;
  }

  .search-button {
    position: absolute;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    justify-items: center;
    align-items: center;
  }
  .search-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #000;
    padding: 1rem 2rem;
    transition: trasnsoform 0.3s ease-in-out;
    transform: translateY(-100%);
    z-index: 60;
  }

  .mobile-menu.open {
    transform: translateY(0);
  }
  .mobile-menu a {
    display: block;
    padding: 0.5rem 0;
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease-in-out,
      visibility 0.3s ease-in-out;
    z-index: 55;
  }

  .overlay.show {
    opacity: 1;
    visibility: visible;
  }
</style>
