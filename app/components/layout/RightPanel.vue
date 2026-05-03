<script setup lang="ts">
const { t } = useI18n()

const panels = [
	{ key: 'toc', icon: 'lucide:list', label: t('panel.toc') },
	{ key: 'editor', icon: 'lucide:code', label: t('panel.editor') },
	{ key: 'cards', icon: 'lucide:gallery-vertical', label: t('panel.cards') },
	{ key: 'comments', icon: 'lucide:message-square', label: t('panel.comments') },
]

const activePanel = 'toc'

interface Heading {
	id: string
	text: string
	level: 2 | 3
	active?: boolean
}

const headings: Heading[] = [
	{ id: 'wat-zijn-closures', text: 'Wat zijn closures?', level: 2, active: true },
	{ id: 'lexical-scope', text: 'Lexical scope', level: 3 },
	{ id: 'variabelen-vasthouden', text: 'Variabelen vasthouden', level: 3 },
	{ id: 'praktische-voorbeelden', text: 'Praktische voorbeelden', level: 2 },
	{ id: 'counter-pattern', text: 'Counter pattern', level: 3 },
	{ id: 'module-pattern', text: 'Module pattern', level: 3 },
	{ id: 'veelgemaakte-fouten', text: 'Veelgemaakte fouten', level: 2 },
]
</script>

<template>
	<div class="flex flex-col gap-3 p-3">
		<div class="flex items-center gap-1 border-b border-(--ui-border) pb-3">
			<UTooltip
				v-for="panel in panels"
				:key="panel.key"
				:text="panel.label"
			>
				<UButton
					:icon="panel.icon"
					:color="panel.key === activePanel ? 'primary' : 'neutral'"
					:variant="panel.key === activePanel ? 'soft' : 'ghost'"
					:aria-label="panel.label"
				/>
			</UTooltip>
		</div>

		<nav class="flex flex-col gap-0.5 text-sm">
			<a
				v-for="heading in headings"
				:key="heading.id"
				:href="`#${heading.id}`"
				class="block py-1 transition-colors"
				:class="[
					heading.level === 3 ? 'pl-4' : 'pl-1',
					heading.active
						? 'text-(--ui-primary) font-medium'
						: 'text-(--ui-text-muted) hover:text-(--ui-text-highlighted)',
				]"
			>
				{{ heading.text }}
			</a>
		</nav>
	</div>
</template>
