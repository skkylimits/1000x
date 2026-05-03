<script setup lang="ts">
const surround = [
	{
		path: '/syntax/javascript/functions',
		title: 'Functions',
		description: 'De bouwstenen van iedere JavaScript-applicatie — declaraties, expressions, en het verschil tussen regular en arrow functions.',
	},
	{
		path: '/syntax/javascript/async',
		title: 'Async',
		description: 'Asynchrone JavaScript via Promises, async/await, en de event loop. Zonder dit ben je verloren in modern web.',
	},
]
</script>

<template>
	<UContentSurround :surround="surround" />
</template>
