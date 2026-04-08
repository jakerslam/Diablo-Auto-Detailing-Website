<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<div class={cn('rounded-2xl border border-white/15 bg-[rgba(15,26,48,0.8)] backdrop-blur-sm', className)}><slot /></div>
