export interface NavNode {
	path: string
	slug: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	children: NavNode[]
	meta: {
		variants: string[]
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
	variants?: Array<{ id: string, label: string, icon: string }>
}

const VARIANT_STEM_RE = /^(?<base>.+?)\.(?<variant>[^./]+)\.(?<lang>nl|en)(?:\.md)?$/

interface VariantInfo {
	base: string
	variant: string
	lang: string
}

function parseVariantStem(stem: string | undefined): VariantInfo | null {
	if (!stem)
		return null
	const m = VARIANT_STEM_RE.exec(stem)
	if (!m || !m.groups)
		return null
	return { base: m.groups.base!, variant: m.groups.variant!, lang: m.groups.lang! }
}

function isIndexStem(stem: string | undefined): boolean {
	return stem === 'index.md' || stem === 'index'
}

function lastSlug(path: string): string {
	const parts = path.split('/').filter(Boolean)
	return parts[parts.length - 1] ?? ''
}

function parentPath(path: string): string {
	const parts = path.split('/').filter(Boolean)
	if (parts.length <= 1)
		return '/'
	return `/${parts.slice(0, -1).join('/')}`
}

interface RawDescriptor {
	path: string
	canonical: ContentPageLike
	variants: string[]
	isDirectory: boolean
}

function pickCanonical(group: ContentPageLike[]): RawDescriptor {
	const path = group[0]!.path
	const parsed = group.map(p => ({ page: p, vi: parseVariantStem(p.stem) }))
	const allVariant = parsed.length > 0 && parsed.every(x => x.vi !== null)

	if (group.length > 1 && allVariant) {
		const withDeclaredVariants = parsed.find(x => x.page.variants && x.page.variants.length > 0)
		const canonical = withDeclaredVariants
			? withDeclaredVariants.page
			: [...parsed].sort((a, b) => a.vi!.variant.localeCompare(b.vi!.variant))[0]!.page
		const variants = parsed.map(x => x.vi!.variant).sort()
		return {
			path,
			canonical,
			variants,
			isDirectory: isIndexStem(canonical.stem),
		}
	}

	const canonical = group[0]!
	return {
		path,
		canonical,
		variants: [],
		isDirectory: isIndexStem(canonical.stem),
	}
}

export function buildTree(pages: ContentPageLike[], _overlay?: NavOverlay): NavTree {
	const byPath = new Map<string, ContentPageLike[]>()
	for (const p of pages) {
		const arr = byPath.get(p.path)
		if (arr)
			arr.push(p)
		else byPath.set(p.path, [p])
	}

	const rawByPath = new Map<string, RawDescriptor>()
	for (const [path, group] of byPath)
		rawByPath.set(path, pickCanonical(group))

	const lookup = new Map<string, NavNode>()
	for (const [path, raw] of rawByPath) {
		const node: NavNode = {
			path,
			slug: lastSlug(path),
			title: raw.canonical.title,
			description: raw.canonical.description,
			icon: raw.canonical.icon,
			scope: raw.canonical.scope,
			children: [],
			meta: {
				variants: raw.variants,
				isDirectory: raw.isDirectory,
			},
		}
		lookup.set(path, node)
	}

	const roots: NavNode[] = []
	for (const [path, node] of lookup) {
		const pp = parentPath(path)
		const parent = lookup.get(pp)
		if (parent && parent !== node)
			parent.children.push(node)
		else
			roots.push(node)
	}

	for (const [path, node] of lookup) {
		if (node.children.length === 0)
			continue
		const navArray = rawByPath.get(path)?.canonical.nav
		if (navArray && navArray.length > 0) {
			const indexMap = new Map(navArray.map((s, i) => [s, i]))
			node.children.sort((a, b) => {
				const ia = indexMap.get(a.slug)
				const ib = indexMap.get(b.slug)
				if (ia !== undefined && ib !== undefined)
					return ia - ib
				if (ia !== undefined)
					return -1
				if (ib !== undefined)
					return 1
				return a.slug.localeCompare(b.slug)
			})
			continue
		}

		const hasOrder = node.children.some((c) => {
			const raw = rawByPath.get(c.path)
			return raw?.canonical.order !== undefined
		})
		if (hasOrder) {
			node.children.sort((a, b) => {
				const oa = rawByPath.get(a.path)?.canonical.order ?? Number.POSITIVE_INFINITY
				const ob = rawByPath.get(b.path)?.canonical.order ?? Number.POSITIVE_INFINITY
				if (oa !== ob)
					return oa - ob
				return a.title.localeCompare(b.title)
			})
		}
		else {
			node.children.sort((a, b) => a.title.localeCompare(b.title))
		}
	}

	roots.sort((a, b) => a.title.localeCompare(b.title))

	for (const [path, node] of lookup) {
		if (!node.meta.isDirectory)
			continue
		const isScopeLabel = node.scope === 'self' || node.scope === 'children'
		const hasChildPage = node.children.some(c => !c.meta.isDirectory)
		if ((isScopeLabel || hasChildPage) && !node.icon) {
			const sourceFile = rawByPath.get(path)?.canonical.stem ?? 'index.md'
			throw new Error(`buildTree: missing required \`icon\` on ${path} (declared in ${sourceFile})`)
		}
	}

	return { roots, lookup }
}

export function walkScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null {
	if (!lookup.has(routePath))
		return null
	const segments = routePath.split('/').filter(Boolean)
	let topLevel: NavNode | null = null
	for (let i = segments.length - 1; i >= 1; i--) {
		const path = `/${segments.slice(0, i).join('/')}`
		const node = lookup.get(path)
		if (!node)
			continue
		topLevel = node
		if (node.scope === 'self' || node.scope === 'children')
			return node
	}
	return topLevel
}

export function walkBreadcrumb(routePath: string, lookup: Map<string, NavNode>): NavNode[] {
	if (!lookup.has(routePath))
		return []
	const segments = routePath.split('/').filter(Boolean)
	const out: NavNode[] = []
	for (let i = 1; i <= segments.length; i++) {
		const path = `/${segments.slice(0, i).join('/')}`
		const node = lookup.get(path)
		if (node)
			out.push(node)
	}
	return out
}

export function flattenForPrevNext(tree: NavTree): NavNode[] {
	const out: NavNode[] = []
	function walk(node: NavNode): void {
		const isScopeLabel = node.scope === 'self' || node.scope === 'children'
		if (!isScopeLabel)
			out.push(node)
		for (const c of node.children)
			walk(c)
	}
	for (const root of tree.roots)
		walk(root)
	return out
}
