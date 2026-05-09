<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const currentScope = await useCurrentScope()

const scopeNode = computed(() => currentScope.value)

const chapters = computed<NavNode[]>(() =>
	(scopeNode.value?.children ?? []).filter(c => c.meta.isDirectory),
)

const orphanPages = computed<NavNode[]>(() =>
	(scopeNode.value?.children ?? []).filter(c => !c.meta.isDirectory),
)
</script>

<template>
	<nav v-if="scopeNode" class="flex flex-col gap-1 p-3 text-sm">
		<div
			class="mb-2 flex items-center gap-2 px-2 py-1.5 font-semibold text-(--ui-text-highlighted)"
		>
			<UIcon
				v-if="scopeNode.icon"
				:name="scopeNode.icon"
				class="size-4 text-(--ui-primary)"
			/>
			<span>{{ scopeNode.title }}</span>
		</div>

		<LayoutSidebarPageList v-if="orphanPages.length" :pages="orphanPages" />

		<LayoutSidebarChapter
			v-for="chapter in chapters"
			:key="chapter.path"
			:chapter="chapter"
		/>
	</nav>
</template>
