<script setup lang="ts">
const { t } = useI18n()

interface Page {
	key: string
	label: string
}
interface Chapter {
	key: string
	label: string
	icon: string
	expanded: boolean
	pages: Page[]
}

const chapters: Chapter[] = [
	{
		key: 'javascript',
		label: 'JavaScript',
		icon: 'simple-icons:javascript',
		expanded: true,
		pages: [
			{ key: 'variables', label: 'Variables' },
			{ key: 'functions', label: 'Functions' },
			{ key: 'closures', label: 'Closures' },
			{ key: 'async', label: 'Async' },
			{ key: 'modules', label: 'Modules' },
		],
	},
	{
		key: 'python',
		label: 'Python',
		icon: 'simple-icons:python',
		expanded: false,
		pages: [],
	},
]

const activePageKey = 'closures'

const contextItems = [
	[
		{ label: t('sidebar.rename'), icon: 'lucide:pencil' },
		{ label: t('sidebar.delete'), icon: 'lucide:trash-2' },
	],
]
</script>

<template>
	<div class="flex flex-col gap-1 p-3 text-sm">
		<div
			class="mb-2 flex items-center gap-2 px-2 py-1.5 font-semibold text-(--ui-text-highlighted)"
		>
			<UIcon name="lucide:code-2" class="size-4 text-primary" />
			<span>{{ $t('nav.syntax') }}</span>
		</div>

		<div v-for="chapter in chapters" :key="chapter.key" class="flex flex-col">
			<UContextMenu :items="contextItems">
				<button
					type="button"
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-(--ui-text) transition-colors hover:bg-(--ui-bg-elevated)"
				>
					<UIcon :name="chapter.icon" class="size-4 shrink-0" />
					<span class="flex-1 text-left font-medium">{{ chapter.label }}</span>
					<UIcon
						name="lucide:chevron-right"
						class="size-4 shrink-0 text-(--ui-text-muted) transition-transform"
						:class="{ 'rotate-90': chapter.expanded }"
					/>
				</button>
			</UContextMenu>

			<div v-if="chapter.expanded" class="ml-4 mt-0.5 flex flex-col">
				<UContextMenu
					v-for="page in chapter.pages"
					:key="page.key"
					:items="contextItems"
				>
					<button
						type="button"
						class="flex w-full items-center border-l py-1.5 pl-4 pr-2 text-left transition-colors"
						:class="page.key === activePageKey
							? 'border-(--ui-primary) text-(--ui-primary) font-medium'
							: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
					>
						{{ page.label }}
					</button>
				</UContextMenu>

				<button
					type="button"
					class="mt-1 -ml-2 flex w-full items-center gap-2 rounded py-1 pr-2 text-(--ui-text-dimmed) transition-colors hover:text-(--ui-text)"
				>
					<span
						class="inline-flex size-4 items-center justify-center rounded border border-dashed border-(--ui-border) bg-(--ui-bg) text-xs leading-none"
					>+</span>
					<span class="text-xs">{{ $t('sidebar.new_page').replace(/^\+\s*/, '') }}</span>
				</button>
			</div>
		</div>

		<button
			type="button"
			class="mt-2 flex w-full items-center gap-2 rounded px-2 py-1.5 text-(--ui-text-dimmed) transition-colors hover:text-(--ui-text)"
		>
			<span
				class="inline-flex size-4 items-center justify-center rounded border border-dashed border-(--ui-border) text-xs leading-none"
			>+</span>
			<span class="text-xs">{{ $t('sidebar.new_chapter').replace(/^\+\s*/, '') }}</span>
		</button>
	</div>
</template>
