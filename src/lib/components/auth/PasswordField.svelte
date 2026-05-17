<script lang="ts">
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import StrengthMeter from './StrengthMeter.svelte';
  import { scorePassword } from './passwordStrength';

  type Props = {
    id: string;
    name?: string;
    label: string;
    autocomplete?: 'current-password' | 'new-password';
    value?: string;
    error?: string;
    required?: boolean;
    minlength?: number;
    showStrength?: boolean;
  };

  let {
    id,
    name,
    label,
    autocomplete = 'current-password',
    value = $bindable(''),
    error = '',
    required = false,
    minlength,
    showStrength = false
  }: Props = $props();

  let revealed = $state(false);
  const strength = $derived(showStrength ? scorePassword(value) : null);
  const errorId = $derived(`${id}-error`);
</script>

<div class="relative mb-[14px]">
  <input
    {id}
    name={name ?? id}
    type={revealed ? 'text' : 'password'}
    {autocomplete}
    {required}
    {minlength}
    placeholder=" "
    aria-invalid={!!error || undefined}
    aria-describedby={error ? errorId : undefined}
    bind:value
    class="
      peer focus:border-brand h-14 w-full rounded-lg border bg-[var(--auth-input-bg)] px-4 pt-6 pr-12
      pb-2 font-sans text-[15px] text-white transition-colors
      duration-(--duration-fast,150ms)
      ease-(--ease-standard) outline-none
      not-placeholder-shown:border-white/40 not-placeholder-shown:bg-[var(--auth-input-bg-focus)]
      placeholder:text-transparent focus:bg-[var(--auth-input-bg-focus)]
      {error
      ? 'border-auth-error focus:border-auth-error bg-[var(--auth-error-bg)]'
      : 'border-line'}
    "
  />
  <label
    for={id}
    class="
      peer-not-placeholder-shown:text-auth-muted-2 peer-focus:text-brand pointer-events-none absolute top-7 left-4 -translate-y-1/2
      px-1
      text-[14px] transition-all
      duration-(--duration-fast,150ms) ease-(--ease-standard)
      peer-not-placeholder-shown:top-[14px] peer-not-placeholder-shown:translate-y-0
      peer-not-placeholder-shown:text-[11px]
      peer-not-placeholder-shown:tracking-[0.5px] peer-focus:top-[14px] peer-focus:translate-y-0
      peer-focus:text-[11px] peer-focus:tracking-[0.5px]
      {error
      ? 'text-auth-error peer-focus:text-auth-error peer-not-placeholder-shown:text-auth-error'
      : 'text-fg-2'}
    "
  >
    {label}
  </label>
  <button
    type="button"
    aria-label={revealed ? 'Hide password' : 'Show password'}
    tabindex={-1}
    onclick={() => (revealed = !revealed)}
    class="
      text-fg-2 absolute top-7 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer
      items-center justify-center rounded-full border-0 bg-transparent transition-colors
      duration-(--duration-fast,150ms) ease-(--ease-standard)
      hover:bg-white/[0.06] hover:text-white
    "
  >
    {#if revealed}
      <EyeOff size={18} strokeWidth={2} />
    {:else}
      <Eye size={18} strokeWidth={2} />
    {/if}
  </button>

  {#if showStrength && strength}
    <StrengthMeter level={strength.level} message={strength.message} />
  {/if}

  {#if error}
    <p id={errorId} class="text-auth-error mt-2 mb-0 flex items-center gap-1.5 px-1 text-[12px]">
      <AlertCircle size={14} strokeWidth={2} />
      {error}
    </p>
  {/if}
</div>
