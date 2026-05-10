<script setup lang="ts">
const { t } = useI18n()
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: t('page.notFound.title'), fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
	titleTemplate: '',
	title,
	ogTitle: title,
	description,
	ogDescription: description,
})
</script>

<template>
	<ContentRenderer
		v-if="page"
		:value="page"
		:prose="false"
	/>
</template>
