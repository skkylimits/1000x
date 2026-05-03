<script setup lang="ts">
const { t } = useI18n()

type Mode = 'view' | 'edit'
const mode = ref<Mode>('view')

const dropdownItems = computed(() => [
	[
		{ label: t('page.copy_markdown'), icon: 'lucide:file-code' },
		{ label: t('page.open_claude'), icon: 'simple-icons:claude' },
		{ label: t('page.open_chatgpt'), icon: 'simple-icons:openai' },
		{ label: t('page.view_markdown'), icon: 'lucide:file-text' },
	],
])
</script>

<template>
	<div class="flex items-center gap-2">
		<UFieldGroup size="sm">
			<UButton
				icon="lucide:eye"
				:color="mode === 'view' ? 'primary' : 'neutral'"
				:variant="mode === 'view' ? 'soft' : 'ghost'"
				:aria-label="t('page.view')"
				@click="mode = 'view'"
			>
				<span class="@max-xl:hidden">{{ t('page.view') }}</span>
			</UButton>
			<UButton
				icon="lucide:pencil-line"
				:color="mode === 'edit' ? 'primary' : 'neutral'"
				:variant="mode === 'edit' ? 'soft' : 'ghost'"
				:aria-label="t('page.edit')"
				@click="mode = 'edit'"
			>
				<span class="@max-xl:hidden">{{ t('page.edit') }}</span>
			</UButton>
		</UFieldGroup>

		<UFieldGroup size="sm">
			<UButton
				icon="lucide:copy"
				color="neutral"
				variant="ghost"
				:aria-label="t('page.copy')"
			>
				<span class="@max-xl:hidden">{{ t('page.copy') }}</span>
			</UButton>
			<UDropdownMenu :items="dropdownItems">
				<UButton
					icon="lucide:chevron-down"
					color="neutral"
					variant="ghost"
					:aria-label="t('page.copy_markdown')"
				/>
			</UDropdownMenu>
		</UFieldGroup>
	</div>
</template>
