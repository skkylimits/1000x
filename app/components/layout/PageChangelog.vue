<script setup lang="ts">
interface Author {
	name: string
	initials: string
	avatarClass: string
}

interface Commit {
	hash: string
	author: Author
	message: string
	pr?: number
}

interface Version {
	id: string
	label: string
	date: string
	commits: Commit[]
}

const joost: Author = {
	name: 'Joost de Vries',
	initials: 'JV',
	avatarClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
}

const sara: Author = {
	name: 'Sara Bakker',
	initials: 'SB',
	avatarClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
}

const versions: Version[] = [
	{
		id: 'v0-3',
		label: 'v0.3',
		date: '3 mei 2026',
		commits: [
			{
				hash: '7d1e8',
				author: joost,
				message: 'voorbeelden uitgebreid met module pattern',
				pr: 42,
			},
			{
				hash: '9a2b1',
				author: joost,
				message: 'typo\'s gecorrigeerd in lexical scope sectie',
			},
		],
	},
	{
		id: 'v0-2',
		label: 'v0.2',
		date: '28 april 2026',
		commits: [
			{
				hash: 'c9704',
				author: sara,
				message: 'lexical scope sectie herschreven',
				pr: 38,
			},
			{
				hash: '3f81d',
				author: sara,
				message: 'code voorbeelden toegevoegd',
			},
		],
	},
	{
		id: 'v0-1',
		label: 'v0.1',
		date: '15 april 2026',
		commits: [
			{
				hash: '5cb65',
				author: joost,
				message: 'initiële versie van closures pagina',
			},
		],
	},
]
</script>

<template>
	<section>
		<h2 class="mb-6 text-2xl font-bold tracking-tight text-(--ui-text-highlighted)">
			{{ $t('page.changelog') }}
		</h2>

		<ol class="relative ml-3 border-l border-(--ui-border)">
			<li
				v-for="version in versions"
				:key="version.id"
				class="pb-8 last:pb-0"
			>
				<div class="relative flex items-center gap-3 pl-6">
					<span
						class="absolute -left-3 flex size-6 items-center justify-center rounded-full bg-(--ui-bg) text-(--ui-text-muted)"
					>
						<UIcon name="lucide:tag" class="size-3.5" />
					</span>
					<UBadge
						:label="version.label"
						color="primary"
						variant="soft"
						size="sm"
					/>
					<span class="ml-auto text-sm text-(--ui-text-muted)">{{ version.date }}</span>
				</div>

				<ul class="mt-3 space-y-3 pl-6">
					<li
						v-for="commit in version.commits"
						:key="commit.hash"
						class="flex flex-wrap items-center gap-2 text-sm"
					>
						<code
							class="rounded border border-(--ui-border) bg-(--ui-bg-elevated) px-1.5 py-0.5 font-mono text-xs text-(--ui-text-muted)"
						>{{ commit.hash }}</code>
						<span class="text-(--ui-text-muted)">—</span>
						<UAvatar
							:text="commit.author.initials"
							size="2xs"
							:ui="{ root: commit.author.avatarClass }"
						/>
						<span class="font-semibold text-(--ui-text-highlighted)">
							{{ commit.author.name }}
						</span>
						<span class="text-(--ui-text-muted)">:</span>
						<span class="text-(--ui-text)">{{ commit.message }}</span>
						<a
							v-if="commit.pr"
							href="#"
							class="text-(--ui-primary) hover:underline"
						>#{{ commit.pr }}</a>
					</li>
				</ul>
			</li>
		</ol>
	</section>
</template>
