<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () =>
	queryCollection('content').path(route.path).first())

useSeoMeta({
	title: () => page.value?.title,
	description: () => page.value?.description,
})

const contentTabs = computed(() => [
	{ value: 'content', label: t('page.tab_content'), icon: 'lucide:book-open' },
	{ value: 'examples', label: t('page.tab_examples'), icon: 'lucide:code' },
	{ value: 'exercises', label: t('page.tab_exercises'), icon: 'lucide:dumbbell' },
	{ value: 'notes', label: t('page.tab_notes'), icon: 'lucide:notebook-pen' },
	{ value: 'cheatsheet', label: t('page.tab_cheatsheet'), icon: 'lucide:list-checks' },
	{ value: 'faq', label: t('page.tab_faq'), icon: 'lucide:circle-help' },
])

const activeTab = ref('content')
</script>

<template>
	<div v-if="page">
		<PageBreadcrumb class="mb-4" />

		<div class="@container mb-3 flex items-start justify-between gap-6">
			<h1 class="text-4xl font-bold tracking-tight">
				{{ page.title }}
			</h1>
			<PageActionBar class="mt-2 shrink-0" />
		</div>

		<p
			v-if="page.description"
			class="mb-8 text-lg text-(--ui-text-muted)"
		>
			{{ page.description }}
		</p>

		<PageContentTabs v-model="activeTab" :items="contentTabs" class="mb-6" />

		<div v-if="activeTab === 'content'" class="prose dark:prose-invert max-w-none">
			<ContentRenderer :value="page" />
		</div>
		<div v-else class="text-(--ui-text-muted)">
			Placeholder voor tab "{{ contentTabs.find(t => t.value === activeTab)?.label }}".
		</div>
	</div>
	<div v-else class="text-(--ui-text-muted)">
		Pagina niet gevonden.
	</div>
</template>
