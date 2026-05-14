export type NavKind
	= | 'page'
		| 'chapter'
		| 'levels-container'
		| 'tabs-container'
		| 'level'
		| 'tab'

export interface NavNode {
	path: string
	slug: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	children: NavNode[]
	meta: {
		kind: NavKind
		isDirectory: boolean
	}
}

export interface NavTree {
	roots: NavNode[]
	lookup: Map<string, NavNode>
}

export type NavOverlay = Record<string, never>

export interface ContentPageLike {
	path: string
	_id?: string
	stem?: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	nav?: string[]
	order?: number
	levels?: boolean | string[]
	tabs?: boolean | string[]
}

function parentOf(path: string): string | null {
	const idx = path.lastIndexOf('/')
	if (idx <= 0)
		return null
	return path.substring(0, idx)
}

function isIndexEntry(p: ContentPageLike): boolean {
	return p.stem === 'index.md' || p.stem === 'index'
}

function hasFlag(value: boolean | string[] | undefined): boolean {
	return value !== undefined && value !== false
}

function sortByArrayThenSlug(children: NavNode[], array: string[]): void {
	const arrayIndex = new Map(array.map((s, i) => [s, i]))
	children.sort((a, b) => {
		const ai = arrayIndex.get(a.slug) ?? Number.POSITIVE_INFINITY
		const bi = arrayIndex.get(b.slug) ?? Number.POSITIVE_INFINITY
		if (ai !== bi)
			return ai - bi
		return a.slug.localeCompare(b.slug)
	})
}

function orderResolver(
	parent: NavNode,
	parentEntry: ContentPageLike | undefined,
	allEntries: Map<string, ContentPageLike>,
): void {
	const children = parent.children
	if (children.length === 0)
		return

	const nav = parentEntry?.nav
	if (nav && nav.length > 0) {
		const navIndex = new Map(nav.map((s, i) => [s, i]))
		const inNav: NavNode[] = []
		const notInNav: NavNode[] = []
		for (const c of children) {
			if (navIndex.has(c.slug))
				inNav.push(c)
			else
				notInNav.push(c)
		}
		inNav.sort((a, b) => navIndex.get(a.slug)! - navIndex.get(b.slug)!)
		notInNav.sort((a, b) => a.slug.localeCompare(b.slug))
		parent.children = [...inNav, ...notInNav]
		return
	}

	if (parent.meta.kind === 'levels-container') {
		const levelsArray = Array.isArray(parentEntry?.levels) ? parentEntry.levels : null
		if (levelsArray)
			sortByArrayThenSlug(children, levelsArray)
		else
			children.sort((a, b) => a.slug.localeCompare(b.slug))
		return
	}

	if (parent.meta.kind === 'tabs-container') {
		const tabsArray = Array.isArray(parentEntry?.tabs) ? parentEntry.tabs : null
		if (tabsArray)
			sortByArrayThenSlug(children, tabsArray)
		else
			children.sort((a, b) => a.slug.localeCompare(b.slug))
		return
	}

	const childOrder = new Map<string, number | undefined>()
	for (const c of children)
		childOrder.set(c.path, allEntries.get(c.path)?.order)

	children.sort((a, b) => {
		const ao = childOrder.get(a.path)
		const bo = childOrder.get(b.path)
		if (ao !== undefined && bo !== undefined)
			return ao - bo
		if (ao !== undefined)
			return -1
		if (bo !== undefined)
			return 1
		return a.title.localeCompare(b.title)
	})
}

export function buildTree(pages: ContentPageLike[], _overlay?: NavOverlay): NavTree {
	const dirEntries = new Map<string, ContentPageLike>()
	const allEntries = new Map<string, ContentPageLike>()
	for (const p of pages) {
		allEntries.set(p.path, p)
		if (isIndexEntry(p))
			dirEntries.set(p.path, p)
	}

	const lookup = new Map<string, NavNode>()
	for (const p of pages) {
		const segments = p.path.split('/')
		const slug = segments[segments.length - 1] ?? ''
		lookup.set(p.path, {
			path: p.path,
			slug,
			title: p.title,
			description: p.description,
			icon: p.icon,
			scope: p.scope,
			children: [],
			meta: {
				kind: 'page',
				isDirectory: dirEntries.has(p.path),
			},
		})
	}

	const roots: NavNode[] = []
	for (const node of lookup.values()) {
		const parent = parentOf(node.path)
		const parentNode = parent ? lookup.get(parent) : undefined
		if (parentNode)
			parentNode.children.push(node)
		else
			roots.push(node)
	}

	for (const node of lookup.values()) {
		const entry = dirEntries.get(node.path)
		const parentPath = parentOf(node.path)
		const parentEntry = parentPath ? dirEntries.get(parentPath) : undefined

		if (!entry) {
			node.meta.kind = hasFlag(parentEntry?.tabs) ? 'tab' : 'page'
			continue
		}

		const dirHasLevels = hasFlag(entry.levels)
		const dirHasTabs = hasFlag(entry.tabs)
		if (dirHasLevels && dirHasTabs)
			throw new Error(`buildTree: directory ${node.path} declares both \`levels\` and \`tabs\` — choose one`)

		if (dirHasLevels)
			node.meta.kind = 'levels-container'
		else if (dirHasTabs)
			node.meta.kind = 'tabs-container'
		else if (hasFlag(parentEntry?.levels))
			node.meta.kind = 'level'
		else if (hasFlag(parentEntry?.tabs))
			node.meta.kind = 'tab'
		else if (node.children.length > 0)
			node.meta.kind = 'chapter'
		else
			node.meta.kind = 'page'
	}

	for (const node of lookup.values()) {
		const entry = dirEntries.get(node.path)
		if (!entry)
			continue

		const isScope = entry.scope === 'self' || entry.scope === 'children'
		const isChapter = node.meta.kind === 'chapter'
		const isLevel = node.meta.kind === 'level'

		if ((isScope || isChapter || isLevel) && !entry.icon)
			throw new Error(`buildTree: missing required \`icon\` on ${node.path} (declared in index.md)`)
	}

	for (const node of lookup.values())
		orderResolver(node, dirEntries.get(node.path), allEntries)

	roots.sort((a, b) => {
		const ao = allEntries.get(a.path)?.order
		const bo = allEntries.get(b.path)?.order
		if (ao !== undefined && bo !== undefined)
			return ao - bo
		if (ao !== undefined)
			return -1
		if (bo !== undefined)
			return 1
		return a.title.localeCompare(b.title)
	})

	return { roots, lookup }
}

export function walkScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null {
	const current = lookup.get(routePath)
	if (!current)
		return null

	const chain: NavNode[] = [current]
	let p = routePath
	while (true) {
		const idx = p.lastIndexOf('/')
		if (idx <= 0)
			break
		p = p.substring(0, idx)
		const node = lookup.get(p)
		if (node)
			chain.push(node)
	}

	for (const a of chain) {
		if (a.scope === 'self' || a.scope === 'children')
			return a
	}

	return chain[chain.length - 1]!
}

export function walkEffectiveScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null {
	const scope = walkScope(routePath, lookup)
	if (!scope)
		return null
	if (scope.meta.kind !== 'levels-container')
		return scope
	if (routePath === scope.path)
		return scope

	for (const child of scope.children) {
		if (child.meta.kind === 'level' && (routePath === child.path || routePath.startsWith(`${child.path}/`)))
			return child
	}

	return scope
}

export function walkBreadcrumb(routePath: string, lookup: Map<string, NavNode>): NavNode[] {
	if (!lookup.has(routePath))
		return []

	const paths: string[] = [routePath]
	let p = routePath
	while (true) {
		const idx = p.lastIndexOf('/')
		if (idx <= 0)
			break
		p = p.substring(0, idx)
		if (lookup.has(p))
			paths.unshift(p)
	}

	return paths.map(path => lookup.get(path)!).filter(Boolean)
}
