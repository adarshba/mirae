<script lang="ts">
  type Props = {
    name?: string | null;
    email?: string | null;
    seed?: string | null;
    size?: number;
  };

  const { name, email, seed, size = 30 }: Props = $props();

  const hash = $derived.by(() => {
    const source = seed ?? email ?? name ?? '';
    let h = 0;
    for (let i = 0; i < source.length; i++) {
      h = (h * 31 + source.charCodeAt(i)) >>> 0;
    }
    return h;
  });

  const GLYPHS = ['미', '민', '지', '유', '서', '연', '준', '하', '래', '도', '수', '진'];
  const COLOR_KEYS: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];

  const glyph = $derived(GLYPHS[hash % GLYPHS.length]);
  const colorKey = $derived(COLOR_KEYS[(hash >>> 4) % COLOR_KEYS.length]);

  const bgByKey: Record<'a' | 'b' | 'c' | 'd', string> = {
    a: 'var(--profile-a)',
    b: 'var(--profile-b)',
    c: 'var(--profile-c)',
    d: 'var(--profile-d)'
  };
  const fgByKey: Partial<Record<'a' | 'b' | 'c' | 'd', string>> = { d: 'var(--profile-d-fg)' };

  const fontSize = $derived(Math.round(size * 0.46));
</script>

<span
  class="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md font-extrabold tracking-[-0.5px] text-white"
  style="width:{size}px;height:{size}px;font-size:{fontSize}px;background-image:{bgByKey[
    colorKey
  ]};{fgByKey[colorKey] ? `color:${fgByKey[colorKey]};` : ''}"
  aria-hidden="true"
>
  {glyph}
</span>
