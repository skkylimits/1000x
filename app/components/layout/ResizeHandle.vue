<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		width: number
		min?: number
		max?: number
	}>(),
	{
		min: 240,
		max: 480,
	},
)

const emit = defineEmits<{
	'update:width': [value: number]
}>()

const dragging = ref(false)

let startX = 0
let startWidth = 0

function clamp(value: number): number {
	return Math.min(props.max, Math.max(props.min, value))
}

function onMouseMove(event: MouseEvent) {
	const delta = startX - event.clientX
	emit('update:width', clamp(startWidth + delta))
}

function onMouseUp() {
	dragging.value = false
	window.removeEventListener('mousemove', onMouseMove)
	window.removeEventListener('mouseup', onMouseUp)
	document.body.style.cursor = ''
	document.body.classList.remove('select-none')
}

function onMouseDown(event: MouseEvent) {
	event.preventDefault()
	dragging.value = true
	startX = event.clientX
	startWidth = props.width
	document.body.style.cursor = 'col-resize'
	document.body.classList.add('select-none')
	window.addEventListener('mousemove', onMouseMove)
	window.addEventListener('mouseup', onMouseUp)
}

onBeforeUnmount(() => {
	window.removeEventListener('mousemove', onMouseMove)
	window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
	<div
		role="separator"
		aria-orientation="vertical"
		class="group relative w-px cursor-col-resize bg-(--ui-border) transition-colors"
		:class="{ 'bg-(--ui-primary) w-[3px]': dragging }"
		@mousedown="onMouseDown"
	>
		<div
			class="absolute inset-y-0 -left-1 -right-1 transition-colors group-hover:bg-(--ui-primary)/40"
			:class="{ 'bg-(--ui-primary)/40': dragging }"
		/>
	</div>
</template>
