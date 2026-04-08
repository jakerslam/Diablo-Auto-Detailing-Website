<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<div class={cn('px-5 py-4', className)}><slot /></div>
