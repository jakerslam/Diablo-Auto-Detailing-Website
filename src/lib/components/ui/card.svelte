<script lang="ts">
  import { cn } from '$lib/utils';

  const card = {
    base: 'rounded-2xl border border-white/15 bg-[rgba(15,26,48,0.8)] backdrop-blur-sm card',
  };

  export let className = '';
</script>

<div class={cn(card.base, className)}><slot /></div>
