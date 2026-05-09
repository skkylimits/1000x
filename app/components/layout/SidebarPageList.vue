<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

defineProps<{ pages: NavNode[] }>()

const route = useRoute()
</script>

<template>
	<div class="flex flex-col">
		<NuxtLink
			v-for="page in pages"
			:key="page.path"
			:to="page.path"
			:aria-current="route.path === page.path ? 'page' : undefined"
			class="flex w-full items-center border-l py-1.5 pl-4 pr-2 text-left transition-colors"
			:class="route.path === page.path
				? 'border-(--ui-primary) text-(--ui-primary) font-medium'
				: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
		>
			{{ page.title }}
		</NuxtLink>
	</div>
</template>
