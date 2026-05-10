<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

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
</script>

<template>
	<UHeader
		:ui="{ center: 'flex-1' }"
		:to="header?.to || '/'"
	>
		<UContentSearchButton
			v-if="header?.search"
			:collapsed="false"
			class="w-full"
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
			<UContentSearchButton
				v-if="header?.search"
				class="lg:hidden"
			/>

			<UDropdownMenu :items="localeItems">
				<UButton
					color="neutral"
					variant="ghost"
					icon="i-lucide-globe"
					:aria-label="t('header.localeToggle')"
				/>
			</UDropdownMenu>

			<UColorModeButton v-if="header?.colorMode" />

			<template v-if="header?.links">
				<UButton
					v-for="(link, index) of header.links"
					:key="index"
					v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
				/>
			</template>
		</template>

		<template #body>
			<UContentNavigation
				highlight
				:navigation="navigation"
			/>
		</template>
	</UHeader>
</template>
