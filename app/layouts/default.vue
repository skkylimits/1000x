<script setup lang="ts">
const rightPanelWidth = ref(320)

const headerOffset = '6.25rem'
</script>

<template>
	<div :style="{ '--right-panel-width': `${rightPanelWidth}px` }">
		<AppHeader />
		<VariantTabsBar />

		<div class="grid grid-cols-[260px_minmax(0,1fr)_auto_var(--right-panel-width,320px)] items-start">
			<aside
				class="sticky overflow-y-auto border-r border-(--ui-border)"
				:style="{ top: headerOffset, height: `calc(100vh - ${headerOffset})` }"
			>
				<SectionSidebar />
			</aside>

			<main>
				<article class="mx-auto max-w-3xl px-8 pb-10 pt-6">
					<slot />
				</article>

				<div class="mx-auto max-w-3xl space-y-12 px-8 pb-16">
					<PageChangelog />
					<PagePrevNext />
				</div>
			</main>

			<ResizeHandle
				v-model:width="rightPanelWidth"
				:min="240"
				:max="480"
				class="sticky"
				:style="{ top: headerOffset, height: `calc(100vh - ${headerOffset})` }"
			/>

			<aside
				class="sticky overflow-y-auto border-l border-(--ui-border)"
				:style="{ top: headerOffset, height: `calc(100vh - ${headerOffset})` }"
			>
				<RightPanel />
			</aside>
		</div>
	</div>
</template>
