<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
  import { auth, authErrorMessage } from '$utils/firebase';
  import { AUTH_REDIRECT_DELAY_MS } from '$lib/constants';
  import AuthCard from '$components/auth/AuthCard.svelte';
  import PasswordField from '$components/auth/PasswordField.svelte';
  import PrimaryButton from '$components/auth/PrimaryButton.svelte';
  import Banner from '$components/auth/Banner.svelte';

  const oobCode = $derived(page.params.token ?? '');

  let newPassword = $state('');
  let confirmPassword = $state('');
  // TODO: the "Sign out of other devices" checkbox below is wired to this state
  // but the submit handler never reads it. Either remove the control or call
  // `getAuth().currentUser?.getIdToken(true)` + admin SDK revocation on submit.
  let signOutOthers = $state(true);
  let loading = $state(false);
  let success = $state(false);
  let touched = $state(false);
  let submitError = $state('');
  let resolvedEmail = $state('');
  let codeInvalid = $state(false);

  const mismatch = $derived(
    touched && newPassword !== '' && confirmPassword !== '' && newPassword !== confirmPassword
  );

  const confirmError = $derived(mismatch ? "Passwords don't match." : '');

  onMount(async () => {
    try {
      resolvedEmail = await verifyPasswordResetCode(auth, oobCode);
    } catch (err) {
      codeInvalid = true;
      submitError = authErrorMessage(err);
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    touched = true;
    if (!newPassword || newPassword.length < 8 || newPassword !== confirmPassword) return;
    submitError = '';
    loading = true;
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      loading = false;
      success = true;
      setTimeout(() => goto('/login?reset=ok'), AUTH_REDIRECT_DELAY_MS);
    } catch (err) {
      loading = false;
      submitError = authErrorMessage(err);
    }
  };
</script>

<svelte:head>
  <title>Mirae · Reset Password</title>
</svelte:head>

<AuthCard onsubmit={handleSubmit}>
  <h1 class="auth-title">Set a new password</h1>
  <p class="auth-sub [&_b]:text-zinc-200">
    Reset for <b>{resolvedEmail || 'your account'}</b>. Choose something you haven't used before.
  </p>

  {#if submitError}
    <Banner variant="error">
      <b>{submitError}</b>
      {#if codeInvalid}
        <a href="/forgot">Request a new link</a>.
      {/if}
    </Banner>
  {/if}

  <PasswordField
    id="rp-new"
    label="New password"
    autocomplete="new-password"
    minlength={8}
    bind:value={newPassword}
    showStrength
    required
  />

  <PasswordField
    id="rp-confirm"
    label="Confirm new password"
    autocomplete="new-password"
    minlength={8}
    bind:value={confirmPassword}
    error={confirmError}
    required
  />

  <label class="auth-check !mb-5">
    <input type="checkbox" bind:checked={signOutOthers} />
    <span class="auth-check-box shrink-0"></span>
    Sign out of other devices for security
  </label>

  <PrimaryButton {loading} {success} disabled={codeInvalid}>Save Password</PrimaryButton>
</AuthCard>
