<script setup lang="ts">
const { data: home } = await useAsyncData('home', () =>
	queryCollection('content').path('/').first())

useSeoMeta({
	title: () => home.value?.title,
	description: () => home.value?.description,
})
</script>

<template>
	<div class="mx-auto max-w-3xl px-6 py-12 prose dark:prose-invert">
		<ContentRenderer v-if="home" :value="home" />
		<div v-else>
			{{ $t('app.loading') }}
		</div>
	</div>
</template>
