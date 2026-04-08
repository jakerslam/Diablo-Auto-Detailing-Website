<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<div class={cn('flex flex-col space-y-1.5 border-b border-white/10 px-5 py-4', className)}><slot /></div>
