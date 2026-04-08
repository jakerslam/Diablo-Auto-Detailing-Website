<script lang="ts">
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '$lib/utils';

  const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,box-shadow] duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
      variants: {
        variant: {
          default: 'bg-glow-500 text-slate-900 hover:brightness-110 shadow-lg shadow-glow-500/30',
          secondary: 'bg-white/10 border border-white/30 text-white hover:bg-white/20',
          outline:
            'border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/60',
          ghost: 'bg-transparent text-white/90 hover:bg-white/10'
        },
        size: {
          default: 'h-11 px-6',
          sm: 'h-9 px-4',
          lg: 'h-12 px-8',
          icon: 'h-10 w-10'
        }
      },
      defaultVariants: {
        variant: 'default',
        size: 'default'
      }
    }
  );

  export let variant: VariantProps<typeof buttonVariants>['variant'] = 'default';
  export let size: VariantProps<typeof buttonVariants>['size'] = 'default';
  export let className = '';
  export let href: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;

  const buttonClasses = cn(buttonVariants({ variant, size }), className);
</script>

{#if href}
  <a {href} class={buttonClasses}><slot /></a>
{:else}
  <button {type} class={buttonClasses} {disabled}><slot /></button>
{/if}
