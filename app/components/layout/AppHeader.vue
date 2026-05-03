<script setup lang="ts">
const { t } = useI18n()

const categories = [
	{ key: 'the_lab', label: t('nav.the_lab'), hasChildren: false },
	{ key: 'syntax', label: t('nav.syntax'), hasChildren: true },
	{ key: 'kitt', label: t('nav.kitt'), hasChildren: true },
	{ key: 'vuln', label: t('nav.vuln'), hasChildren: true },
	{ key: 'xpl01ts', label: t('nav.xpl01ts'), hasChildren: true },
	{ key: 'knowledge_base', label: t('nav.knowledge_base'), hasChildren: true },
]

const activeCategory = 'syntax'

const actions = [
	{ key: 'search', icon: 'lucide:search', label: t('header.search') },
	{ key: 'ai', icon: 'lucide:bot', label: t('header.ai') },
	{ key: 'language', icon: 'lucide:languages', label: t('header.language') },
	{ key: 'theme', icon: 'lucide:moon', label: t('header.theme') },
	{ key: 'settings', icon: 'lucide:settings', label: t('header.settings') },
]
</script>

<template>
	<header
		class="sticky top-0 z-40 h-14 border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur"
	>
		<div class="grid h-full grid-cols-[1fr_auto_1fr] items-stretch px-4">
			<div class="flex items-center">
				<NuxtLink
					to="/"
					class="text-lg font-bold tracking-tight text-(--ui-text-highlighted) lowercase"
				>
					<span class="text-primary">1</span><span>000x</span>
				</NuxtLink>
			</div>

			<nav class="flex items-stretch gap-1">
				<button
					v-for="cat in categories"
					:key="cat.key"
					type="button"
					class="-mb-px flex items-center gap-1 border-b-2 px-3 text-sm font-medium transition-colors"
					:class="cat.key === activeCategory
						? 'border-(--ui-primary) text-(--ui-text-highlighted)'
						: 'border-transparent text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
				>
					<span>{{ cat.label }}</span>
					<UIcon
						v-if="cat.hasChildren"
						name="lucide:chevron-down"
						class="size-4 opacity-70"
					/>
				</button>
			</nav>

			<div class="flex items-center justify-end gap-1">
				<UTooltip
					v-for="action in actions"
					:key="action.key"
					:text="action.label"
				>
					<UButton
						:icon="action.icon"
						color="neutral"
						variant="ghost"
						:aria-label="action.label"
					/>
				</UTooltip>
			</div>
		</div>
	</header>
</template>
