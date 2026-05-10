<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
	error: NuxtError
}>()

const { t, locale } = useI18n()

useHead({
	htmlAttrs: {
		lang: locale,
	},
})

useSeoMeta({
	title: () => t('page.notFound.title'),
	description: () => t('page.notFound.description'),
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
	server: false,
})

provide('navigation', navigation)
</script>

<template>
	<UApp>
		<AppHeader />

		<UError :error="error" />

		<AppFooter />

		<ClientOnly>
			<LazyUContentSearch
				:files="files"
				:navigation="navigation"
			/>
		</ClientOnly>
	</UApp>
</template>
