<script lang="ts">
  import { cn } from '$lib/utils';

  export let title = '';
  export let className = '';
</script>

<details class={cn('group rounded-2xl border border-[var(--stroke)] bg-white/[0.08]', className)}>
  <summary class="cursor-pointer list-none px-4 py-3 font-semibold text-[color:var(--text-primary)] outline-none transition-colors hover:text-[color:var(--text-primary)]">
    {title}
  </summary>
  <div class="border-t border-[var(--surface-border)] px-4 py-3 text-sm text-[color:var(--text-muted)]">
    <slot />
  </div>
</details>
