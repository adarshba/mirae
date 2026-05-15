<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import {
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
    signInWithEmailAndPassword
  } from 'firebase/auth';
  import { auth, authErrorMessage } from '$utils/firebase';
  import AuthCard from '$components/auth/AuthCard.svelte';
  import TextField from '$components/auth/TextField.svelte';
  import PasswordField from '$components/auth/PasswordField.svelte';
  import PrimaryButton from '$components/auth/PrimaryButton.svelte';
  import Banner from '$components/auth/Banner.svelte';

  let email = $state('');
  let password = $state('');
  let remember = $state(true);
  let loading = $state(false);
  let success = $state(false);
  let submitError = $state('');

  const resetOk = $derived(page.url.searchParams.get('reset') === 'ok');

  const banner = $derived.by(() => {
    if (submitError) return 'invalid' as const;
    if (resetOk) return 'reset-ok' as const;
    return null;
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    submitError = '';
    loading = true;
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      loading = false;
      success = true;
      setTimeout(() => {
        const next = page.url.searchParams.get('from') ?? '/';
        goto(next);
      }, 700);
    } catch (err) {
      loading = false;
      submitError = authErrorMessage(err);
    }
  };
</script>

<svelte:head>
  <title>Mirae · Sign In</title>
</svelte:head>

<AuthCard onsubmit={handleSubmit}>
  <h1 class="auth-title">Sign in</h1>
  <p class="auth-sub">
    Welcome back. Pick up where you left off — your watchlist and history are waiting.
  </p>

  {#if banner === 'invalid'}
    <Banner variant="error">
      <b>{submitError}</b> Need help? <a href="/forgot">Reset your password</a>.
    </Banner>
  {:else if banner === 'reset-ok'}
    <Banner variant="success">
      <b>Password updated.</b> Sign in with your new password.
    </Banner>
  {/if}

  <TextField
    id="si-email"
    label="Email or phone"
    type="email"
    autocomplete="email"
    inputmode="email"
    bind:value={email}
    required
  />

  <PasswordField
    id="si-pass"
    label="Password"
    autocomplete="current-password"
    bind:value={password}
    required
  />

  <div class="auth-row">
    <label class="auth-check">
      <input type="checkbox" bind:checked={remember} />
      <span class="auth-check-box"></span>
      Remember me
    </label>
    <a href="/forgot" class="auth-link-muted">Need help?</a>
  </div>

  <PrimaryButton {loading} {success}>Sign In</PrimaryButton>

  <div class="auth-foot-link">
    New to Mirae? <a href="/signup">Create an account.</a>
  </div>
  <p class="auth-legal">
    This page is protected to ensure you're not a bot. <a href="/">Learn more</a>.
  </p>
</AuthCard>
