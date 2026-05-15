<script lang="ts">
  import AlertCircle from '@lucide/svelte/icons/alert-circle';

  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    name?: string;
    label: string;
    type?: 'text' | 'email' | 'tel';
    autocomplete?: HTMLInputAttributes['autocomplete'];
    inputmode?: 'text' | 'email' | 'tel';
    value?: string;
    error?: string;
    required?: boolean;
    maxlength?: number;
  };

  let {
    id,
    name,
    label,
    type = 'text',
    autocomplete,
    inputmode,
    value = $bindable(''),
    error = '',
    required = false,
    maxlength
  }: Props = $props();

  const errorId = $derived(`${id}-error`);
</script>

<div class="relative mb-[14px]">
  <input
    {id}
    name={name ?? id}
    {type}
    {autocomplete}
    {inputmode}
    {required}
    {maxlength}
    placeholder=" "
    aria-invalid={!!error || undefined}
    aria-describedby={error ? errorId : undefined}
    bind:value
    class="
      peer focus:border-brand h-14 w-full rounded-lg border bg-[var(--auth-input-bg)] px-4 pt-6
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
  {#if error}
    <p id={errorId} class="text-auth-error mt-2 mb-0 flex items-center gap-1.5 px-1 text-[12px]">
      <AlertCircle size={14} strokeWidth={2} />
      {error}
    </p>
  {/if}
</div>
