<script lang="ts">
  import { cn } from '$lib/utils';

  export let title = '';
  export let className = '';
</script>

<details class={cn('group rounded-2xl border border-white/15 bg-white/[0.08]', className)}>
  <summary class="cursor-pointer list-none px-4 py-3 font-semibold text-white/92 outline-none transition-colors hover:text-white">
    {title}
  </summary>
  <div class="border-t border-white/10 px-4 py-3 text-sm text-white/80">
    <slot />
  </div>
</details>
