<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const tree = await useNavTree()
const scope = useEffectiveScope()
const route = useRoute()

const items = computed<NavNode[]>(() => {
	if (!tree.value)
		return []
	const parent = scope.value
	const list = parent ? parent.children : tree.value.roots
	return list.filter(c => c.meta.kind !== 'levels-container')
})

const expanded = reactive<Record<string, boolean>>({})

function isExpanded(path: string): boolean {
	return expanded[path] ?? false
}

function toggle(path: string): void {
	expanded[path] = !isExpanded(path)
}

function isPathActive(node: NavNode): boolean {
	return route.path === node.path || route.path.startsWith(`${node.path}/`)
}

watchEffect(() => {
	for (const item of items.value) {
		if (item.meta.kind === 'chapter' && isPathActive(item))
			expanded[item.path] = true
	}
})

function visibleChildren(node: NavNode): NavNode[] {
	return node.children.filter(c => c.meta.kind !== 'levels-container')
}
</script>

<template>
	<nav
		aria-label="Sectie navigatie"
		class="flex flex-col gap-1 p-4 text-sm"
	>
		<div
			v-if="scope"
			class="flex items-center gap-2 pb-3 pl-3 text-(--ui-text-highlighted) font-semibold"
		>
			<UIcon
				v-if="scope.icon"
				:name="scope.icon"
				class="size-5 shrink-0"
			/>
			<span class="truncate">{{ scope.title }}</span>
		</div>

		<ul class="flex flex-col gap-px">
			<li
				v-for="node in items"
				:key="node.path"
			>
				<template v-if="node.meta.kind === 'chapter'">
					<button
						type="button"
						:aria-expanded="isExpanded(node.path)"
						class="flex w-full items-center gap-2 rounded-md py-1.5 pl-3 pr-2 text-left text-(--ui-text-muted) hover:text-(--ui-text)"
						@click="toggle(node.path)"
					>
						<UIcon
							v-if="node.icon"
							:name="node.icon"
							class="size-4 shrink-0"
						/>
						<span class="flex-1 truncate">{{ node.title }}</span>
						<UIcon
							name="lucide:chevron-right"
							class="size-4 shrink-0 transition-transform"
							:class="isExpanded(node.path) ? 'rotate-90' : ''"
						/>
					</button>
					<ul
						v-show="isExpanded(node.path)"
						class="mt-px flex flex-col gap-px"
					>
						<li
							v-for="child in visibleChildren(node)"
							:key="child.path"
						>
							<NuxtLink
								:to="child.path"
								:aria-current="route.path === child.path ? 'page' : undefined"
								class="flex items-center gap-2 border-l-2 -ml-0.5 pl-3 pr-2 py-1.5" :class="[
									isPathActive(child)
										? 'border-(--ui-primary) text-(--ui-primary)'
										: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text)',
								]"
							>
								<span class="truncate">{{ child.title }}</span>
							</NuxtLink>
						</li>
					</ul>
				</template>

				<NuxtLink
					v-else
					:to="node.path"
					:aria-current="route.path === node.path ? 'page' : undefined"
					class="flex items-center gap-2 border-l-2 -ml-0.5 pl-3 pr-2 py-1.5" :class="[
						isPathActive(node)
							? 'border-(--ui-primary) text-(--ui-primary)'
							: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text)',
					]"
				>
					<UIcon
						v-if="node.icon"
						:name="node.icon"
						class="size-4 shrink-0"
					/>
					<span class="truncate">{{ node.title }}</span>
				</NuxtLink>
			</li>
		</ul>
	</nav>
</template>
