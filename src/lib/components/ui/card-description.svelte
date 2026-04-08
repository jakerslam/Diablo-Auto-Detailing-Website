<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<p class={cn('text-sm leading-relaxed text-white/74', className)}><slot /></p>
