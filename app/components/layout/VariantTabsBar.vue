<script setup lang="ts">
interface Variant {
	id: string
	label: string
	icon: string
}

const variants: Variant[] = [
	{ id: 'junior', label: 'Junior', icon: 'lucide:user-round' },
	{ id: 'mid', label: 'Mid-level', icon: 'lucide:user-check' },
	{ id: 'senior', label: 'Senior', icon: 'lucide:crown' },
]

const activeVariant = ref('mid')
</script>

<template>
	<div
		class="sticky top-14 z-30 h-11 border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur"
	>
		<div class="flex h-full items-stretch px-4">
			<nav class="flex items-stretch gap-1">
				<button
					v-for="variant in variants"
					:key="variant.id"
					type="button"
					class="-mb-px flex items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors"
					:class="variant.id === activeVariant
						? 'border-(--ui-primary) text-(--ui-text-highlighted)'
						: 'border-transparent text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
					@click="activeVariant = variant.id"
				>
					<UIcon :name="variant.icon" class="size-4" />
					<span>{{ variant.label }}</span>
				</button>
			</nav>

			<button
				type="button"
				class="ml-2 flex items-center justify-center self-center rounded p-1 text-(--ui-text-dimmed) transition-colors hover:bg-(--ui-bg-elevated) hover:text-(--ui-text)"
				aria-label="Nieuwe variant"
			>
				<UIcon name="lucide:plus" class="size-4" />
			</button>
		</div>
	</div>
</template>
