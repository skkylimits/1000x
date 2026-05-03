<script setup lang="ts">
interface Tab {
	value: string
	label: string
	icon: string
}

defineProps<{
	items: Tab[]
}>()

const model = defineModel<string>({ required: true })

const scrollEl = ref<HTMLElement>()
const hasOverflow = ref(false)

function checkOverflow() {
	if (!scrollEl.value)
		return
	hasOverflow.value = scrollEl.value.scrollWidth > scrollEl.value.clientWidth + 1
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
	checkOverflow()
	if (typeof ResizeObserver !== 'undefined' && scrollEl.value) {
		resizeObserver = new ResizeObserver(checkOverflow)
		resizeObserver.observe(scrollEl.value)
	}
})

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
})
</script>

<template>
	<div class="relative flex border-b border-(--ui-border)">
		<div
			ref="scrollEl"
			class="flex flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			@scroll="checkOverflow"
		>
			<button
				v-for="tab in items"
				:key="tab.value"
				type="button"
				class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
				:class="tab.value === model
					? 'border-(--ui-primary) text-(--ui-primary)'
					: 'border-transparent text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
				@click="model = tab.value"
			>
				<UIcon :name="tab.icon" class="size-4 shrink-0" />
				<span>{{ tab.label }}</span>
			</button>
		</div>

		<div
			v-show="hasOverflow"
			class="pointer-events-none absolute inset-y-0 right-9 w-8 bg-gradient-to-r from-transparent to-(--ui-bg)"
		/>

		<button
			type="button"
			class="-mb-px flex shrink-0 items-center justify-center border-b-2 border-transparent bg-(--ui-bg) px-3 text-(--ui-text-dimmed) transition-colors hover:text-(--ui-text)"
			aria-label="Nieuwe tab"
		>
			<UIcon name="lucide:plus" class="size-4" />
		</button>
	</div>
</template>
