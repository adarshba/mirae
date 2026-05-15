<script lang="ts">
  const columns: { title: string; items: string[] }[] = [
    {
      title: 'Help',
      items: ['FAQ', 'Help Center', 'Account', 'Media Center', 'Investor Relations']
    },
    {
      title: 'Browse',
      items: ['K-Dramas', 'Movies', 'Originals', 'New Releases', 'My List']
    },
    {
      title: 'Service',
      items: ['Gift Card', 'Buy Subscription', 'Ways to Watch', 'Use Policy', 'Privacy']
    },
    {
      title: 'About',
      items: ['About Mirae', 'Cookie Preferences', 'Corporate Information', 'Contact Us']
    }
  ];
</script>

<footer class="footer">
  <div class="footer__inner">
    <div class="footer__social">
      <a href="/" aria-label="Facebook" class="footer__social-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M22 12a10 10 0 1 0-11.563 9.875v-6.987H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.461h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.987A10.002 10.002 0 0 0 22 12z"
          />
        </svg>
      </a>
      <a href="/" aria-label="Instagram" class="footer__social-link">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
      <a href="/" aria-label="X / Twitter" class="footer__social-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      </a>
      <a href="/" aria-label="YouTube" class="footer__social-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
        </svg>
      </a>
    </div>

    <div class="footer__grid">
      {#each columns as col (col.title)}
        <div class="footer__col">
          <h4 class="footer__col-title">{col.title}</h4>
          <ul class="footer__list">
            {#each col.items as item (item)}
              <li><a href="/" class="footer__link">{item}</a></li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <button class="footer__service-code" type="button">Service Code</button>

    <p class="footer__copy">
      © 2026 Mirae Korea, Inc. · <span lang="ko">미래</span> · All rights reserved.
    </p>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--bg-card);
    border-top: 1px solid var(--line);
    color: var(--muted-foreground);
    padding: var(--space-12) var(--space-6) var(--space-10);
    margin-top: var(--space-16);
  }

  .footer__inner {
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .footer__social {
    display: flex;
    gap: var(--space-4);
  }

  .footer__social-link {
    color: var(--text-secondary);
    transition: color var(--duration-fast) var(--ease-standard);
  }
  .footer__social-link:hover {
    color: var(--text-primary);
  }

  .footer__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6) var(--space-4);
  }

  .footer__col-title {
    margin: 0 0 var(--space-3);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .footer__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .footer__link {
    color: var(--muted-foreground);
    font-size: 0.8125rem;
    transition: color var(--duration-fast) var(--ease-standard);
  }
  .footer__link:hover {
    color: var(--text-primary);
  }

  .footer__service-code {
    align-self: flex-start;
    padding: var(--space-2) var(--space-3);
    background-color: transparent;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-standard);
  }
  .footer__service-code:hover {
    border-color: var(--text-secondary);
    color: var(--text-secondary);
  }

  .footer__copy {
    margin: 0;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  @media (min-width: 768px) {
    .footer {
      padding: var(--space-16) var(--space-10);
    }
    .footer__grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
