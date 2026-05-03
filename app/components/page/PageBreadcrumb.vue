<script setup lang="ts">
const { t } = useI18n()

interface Crumb {
	label: string
	to?: string
}

const crumbs = computed<Crumb[]>(() => [
	{ label: t('nav.syntax'), to: '/syntax' },
	{ label: 'JavaScript', to: '/syntax/javascript' },
	{ label: 'Closures' },
])
</script>

<template>
	<nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
		<template v-for="(crumb, index) in crumbs" :key="`${index}-${crumb.label}`">
			<UIcon
				v-if="index > 0"
				name="lucide:chevron-right"
				class="size-3.5 shrink-0 text-(--ui-text-muted)"
			/>
			<a
				v-if="crumb.to"
				:href="crumb.to"
				class="text-(--ui-text-muted) transition-colors hover:text-(--ui-text-highlighted)"
				@click.prevent
			>
				{{ crumb.label }}
			</a>
			<span
				v-else
				class="font-medium text-(--ui-primary)"
				aria-current="page"
			>
				{{ crumb.label }}
			</span>
		</template>
	</nav>
</template>
