import type { ContentPageLike, NavTree } from '~/utils/nav'
import { buildTree, walkBreadcrumb, walkEffectiveScope, walkScope } from '~/utils/nav'

interface RawDocPage {
	path: string
	_id?: string
	stem?: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	headerLink?: boolean
	nav?: string[]
	order?: number
	levels?: boolean | string[]
	tabs?: boolean | string[]
}

function isIndexFile(p: RawDocPage): boolean {
	const id = p._id ?? ''
	const stem = p.stem ?? ''
	const idTail = id.split(/[/:]/).pop() ?? ''
	const stemTail = stem.split('/').pop() ?? ''
	return /^(?:\d+\.)?index(?:\.md)?$/.test(idTail)
		|| /^(?:\d+\.)?index(?:\.md)?$/.test(stemTail)
}

function nullToUndef<T>(v: T | null | undefined): T | undefined {
	return v === null ? undefined : v
}

function toContentPageLike(p: RawDocPage): ContentPageLike {
	return {
		path: p.path,
		stem: isIndexFile(p) ? 'index.md' : p.stem,
		title: p.title,
		description: nullToUndef(p.description),
		icon: nullToUndef(p.icon),
		scope: nullToUndef(p.scope),
		headerLink: nullToUndef(p.headerLink),
		nav: nullToUndef(p.nav),
		order: nullToUndef(p.order),
		levels: nullToUndef(p.levels),
		tabs: nullToUndef(p.tabs),
	}
}

export async function useNavTree(): Promise<Ref<NavTree | null>> {
	const treeState = useState<NavTree | null>('nav-tree', () => null)
	if (treeState.value)
		return treeState

	const { data } = await useAsyncData('nav-tree-pages', async () => {
		const pages = await queryCollection('docs').all() as unknown as RawDocPage[]
		return pages.map(toContentPageLike)
	})

	if (data.value)
		treeState.value = buildTree(data.value)

	return treeState
}

export function useCurrentScope() {
	const treeState = useState<NavTree | null>('nav-tree', () => null)
	const route = useRoute()
	return computed(() => {
		if (!treeState.value)
			return null
		return walkScope(route.path, treeState.value.lookup)
	})
}

export function useEffectiveScope() {
	const treeState = useState<NavTree | null>('nav-tree', () => null)
	const route = useRoute()
	return computed(() => {
		if (!treeState.value)
			return null
		return walkEffectiveScope(route.path, treeState.value.lookup)
	})
}

export function useBreadcrumb() {
	const treeState = useState<NavTree | null>('nav-tree', () => null)
	const route = useRoute()
	return computed(() => {
		if (!treeState.value)
			return []
		return walkBreadcrumb(route.path, treeState.value.lookup)
	})
}
