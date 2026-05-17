<script lang="ts">
  import PictureInPicture2 from '@lucide/svelte/icons/picture-in-picture-2';
  import PlayerControlButton from './PlayerControlButton.svelte';

  type Props = {
    onclick: () => void;
  };

  const { onclick }: Props = $props();
</script>

<PlayerControlButton {onclick} label="Picture in Picture" tooltip="Picture-in-Picture (i)">
  <PictureInPicture2 size={22} />
</PlayerControlButton>
