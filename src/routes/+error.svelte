<div class="error-page">
  <h1 class="text-display error-page__code">404</h1>
  <p class="text-h2 error-page__message">Oops! Page Not Found...</p>
  <a class="btn btn-secondary error-page__cta" href="/">Go to Home</a>
</div>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    text-align: center;
  }

  .error-page__code {
    color: var(--accent-danger);
  }

  .error-page__message {
    margin-top: var(--space-4);
    color: var(--text-secondary);
  }

  .error-page__cta {
    margin-top: var(--space-6);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-lg);
    text-decoration: none;
  }
</style>
