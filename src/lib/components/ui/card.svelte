<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<div class={cn('rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm', className)}><slot /></div>
