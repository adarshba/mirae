<script lang="ts">
  type Props = {
    level: 0 | 1 | 2 | 3 | 4;
    message: string;
  };

  const { level, message }: Props = $props();

  const colorByLevel: Record<1 | 2 | 3 | 4, string> = {
    1: 'bg-auth-error',
    2: 'bg-auth-strength-fair',
    3: 'bg-auth-strength-good',
    4: 'bg-success'
  };
</script>

<div class="mt-2 flex gap-1">
  {#each [1, 2, 3, 4] as i (i)}
    <span
      class="h-[3px] flex-1 rounded-full transition-colors duration-200 {level >= i
        ? colorByLevel[level as 1 | 2 | 3 | 4]
        : 'bg-white/10'}"
    ></span>
  {/each}
</div>
<div class="mt-1 text-[11px] tracking-[0.3px] {level === 4 ? 'text-success' : 'text-fg-2'}">
  {message}
</div>
