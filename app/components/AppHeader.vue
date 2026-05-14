<script setup lang="ts">
import { buildHeaderMenuItems } from '~/utils/header-menu'

const tree = await useNavTree()
const route = useRoute()

const { header } = useAppConfig()
const { t, locale, locales, setLocale } = useI18n()

const localeItems = computed(() =>
	(locales.value as Array<{ code: string, name?: string, flag?: string }>).map(l => ({
		label: l.name || l.code,
		icon: l.flag,
		class: l.code === locale.value ? 'bg-accented font-medium' : '',
		onSelect: () => setLocale(l.code as never),
	})),
)

const menuItems = computed(() =>
	buildHeaderMenuItems(tree.value?.roots ?? [], {
		maxItems: header.maxMenuItems ?? 6,
		currentPath: route.path,
	}),
)
</script>

<template>
	<UHeader
		:to="header?.to || '/'"
		:ui="{
			center: 'flex-1 h-full',
		}"
	>
		<UNavigationMenu
			orientation="horizontal"
			variant="link"
			content-orientation="vertical"
			:items="menuItems"
			:ui="{
				root: 'h-full',
				list: 'h-full',
				item: 'h-full py-0',
				link: 'h-full flex items-center relative before:hidden',
				childLinkDescription: 'line-clamp-2',
			}"
			class="justify-center h-full"
		/>

		<template
			v-if="header?.logo?.dark || header?.logo?.light || header?.title"
			#title
		>
			<UColorModeImage
				v-if="header?.logo?.dark || header?.logo?.light"
				:light="header?.logo?.light!"
				:dark="header?.logo?.dark!"
				:alt="header?.logo?.alt"
				class="h-6 w-auto shrink-0"
			/>

			<span v-else-if="header?.title">
				{{ header.title }}
			</span>
		</template>

		<template
			v-else
			#left
		>
			<NuxtLink :to="header?.to || '/'">
				<AppLogo class="w-auto h-6 shrink-0" />
			</NuxtLink>
		</template>

		<template #right>
			<UContentSearchButton v-if="header?.search" />

			<UTooltip :text="t('header.comingSoon')">
				<UButton
					color="neutral"
					variant="ghost"
					icon="i-lucide-bot"
					disabled
					:aria-label="t('header.aiAssistant')"
				/>
			</UTooltip>

			<UDropdownMenu :items="localeItems">
				<UButton
					color="neutral"
					variant="ghost"
					icon="i-lucide-globe"
					:aria-label="t('header.localeToggle')"
				/>
			</UDropdownMenu>

			<UColorModeButton v-if="header?.colorMode" />

			<UTooltip :text="t('header.comingSoon')">
				<UButton
					color="neutral"
					variant="ghost"
					icon="i-lucide-settings"
					disabled
					:aria-label="t('header.settings')"
				/>
			</UTooltip>
		</template>
	</UHeader>
</template>

<style scoped>
/* Reka UI inserts a position:relative wrapper between <nav> and <ul> that has no
   height — it breaks the h-full chain so the active link doesn't reach the
   header's bottom border. Stretch the wrapper so link.bottom === header.bottom
   and the Tailwind after-pseudo lands precisely on the divider. */
:deep([data-reka-navigation-menu] > div[style*='position:relative']) {
	height: 100%;
}
</style>
