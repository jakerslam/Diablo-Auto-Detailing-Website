<script lang="ts">
  import { cn } from '$lib/utils';

  export let href = '';
  export let label = '';
  export let className = '';
  export let rel = 'noopener noreferrer';
  export let target = '_blank';
</script>

<a
  {href}
  {target}
  {rel}
  class={cn('underline hover:text-white', className)}
>
  {label}
</a>
