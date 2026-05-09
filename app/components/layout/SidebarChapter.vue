<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const props = defineProps<{ chapter: NavNode }>()

const expanded = ref(true)
</script>

<template>
	<div class="flex flex-col">
		<button
			type="button"
			class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-(--ui-text) transition-colors hover:bg-(--ui-bg-elevated)"
			@click="expanded = !expanded"
		>
			<UIcon
				v-if="props.chapter.icon"
				:name="props.chapter.icon"
				class="size-4 shrink-0"
			/>
			<span class="flex-1 text-left font-medium">{{ props.chapter.title }}</span>
			<UIcon
				name="lucide:chevron-right"
				class="size-4 shrink-0 text-(--ui-text-muted) transition-transform"
				:class="{ 'rotate-90': expanded }"
			/>
		</button>

		<LayoutSidebarPageList
			v-if="expanded && props.chapter.children.length"
			:pages="props.chapter.children"
			class="ml-4 mt-0.5"
		/>
	</div>
</template>
