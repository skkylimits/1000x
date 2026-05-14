import type { NavNode } from '../../app/utils/nav'
import { describe, expect, it } from 'vitest'
import { buildHeaderMenuItems } from '../../app/utils/header-menu'

function node(p: {
	path: string
	title?: string
	icon?: string
	description?: string
	headerLink?: boolean
	children?: NavNode[]
	kind?: NavNode['meta']['kind']
}): NavNode {
	return {
		path: p.path,
		slug: p.path.split('/').filter(Boolean).pop() ?? '',
		title: p.title ?? p.path,
		icon: p.icon,
		description: p.description,
		headerLink: p.headerLink,
		children: p.children ?? [],
		meta: {
			kind: p.kind ?? 'chapter',
			isDirectory: true,
		},
	}
}

describe('buildHeaderMenuItems — basic shape', () => {
	it('returns [] for empty input', () => {
		const items = buildHeaderMenuItems([], { maxItems: 6, currentPath: '/' })
		expect(items).toEqual([])
	})

	it('truncates roots to maxItems, preserving input order', () => {
		const roots = Array.from({ length: 8 }, (_, i) => node({ path: `/root-${i}`, title: `Root ${i}`, icon: 'i-lucide-cube' }))
		const items = buildHeaderMenuItems(roots, { maxItems: 6, currentPath: '/' })
		expect(items).toHaveLength(6)
		expect(items.map(i => i.label)).toEqual(['Root 0', 'Root 1', 'Root 2', 'Root 3', 'Root 4', 'Root 5'])
	})
})

describe('buildHeaderMenuItems — direct-link vs dropdown rule', () => {
	it('emits a direct link (no children key) when root has 0 children', () => {
		const root = node({ path: '/lab', title: 'The Lab', icon: 'i-lucide-flask-conical' })
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.to).toBe('/lab')
		expect(item.children).toBeUndefined()
	})

	it('emits a direct link when root has exactly 1 (non-container) child', () => {
		const root = node({
			path: '/lab',
			title: 'The Lab',
			icon: 'i-lucide-flask-conical',
			children: [node({ path: '/lab/intro', kind: 'page' })],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.to).toBe('/lab')
		expect(item.children).toBeUndefined()
	})

	it('emits a dropdown when root has 2+ non-container children', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'i-heroicons-code-bracket',
			description: 'scripting languages',
			children: [
				node({ path: '/syntax/git', title: 'Git', icon: 'i-simple-icons-git', description: 'version control', kind: 'chapter' }),
				node({ path: '/syntax/python', title: 'Python', icon: 'i-logos:python', description: 'scripting', kind: 'page' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.children).toHaveLength(2)
		expect(item.children?.[0]).toMatchObject({
			label: 'Git',
			icon: 'i-simple-icons-git',
			to: '/syntax/git',
			description: 'version control',
		})
		expect(item.children?.[1]).toMatchObject({ label: 'Python', to: '/syntax/python' })
	})
})

describe('buildHeaderMenuItems — surfaces all children (no kind-filtering)', () => {
	it('includes levels-container children as regular dropdown entries', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'x',
			children: [
				node({ path: '/syntax/javascript', title: 'JavaScript', icon: 'i-logos:javascript', kind: 'levels-container' }),
				node({ path: '/syntax/git', title: 'Git', icon: 'i-simple-icons-git', kind: 'chapter' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.children).toHaveLength(2)
		expect(item.children?.map(c => c.label)).toEqual(['JavaScript', 'Git'])
		expect(item.children?.[0].to).toBe('/syntax/javascript')
	})

	it('includes tabs-container children as regular dropdown entries', () => {
		const root = node({
			path: '/docs',
			title: 'Docs',
			icon: 'x',
			children: [
				node({ path: '/docs/installation', title: 'Installation', icon: 'x', kind: 'tabs-container' }),
				node({ path: '/docs/usage', title: 'Usage', icon: 'x', kind: 'chapter' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.children).toHaveLength(2)
		expect(item.children?.map(c => c.label)).toEqual(['Installation', 'Usage'])
	})

	it('counts all children when deciding direct-link-vs-dropdown', () => {
		const root = node({
			path: '/mixed',
			title: 'Mixed',
			icon: 'x',
			children: [
				node({ path: '/mixed/a', title: 'a', icon: 'x', kind: 'page' }),
				node({ path: '/mixed/b', title: 'b', icon: 'x', kind: 'levels-container' }),
				node({ path: '/mixed/c', title: 'c', icon: 'x', kind: 'tabs-container' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.children).toHaveLength(3)
		expect(item.children?.map(c => c.label)).toEqual(['a', 'b', 'c'])
	})
})

describe('buildHeaderMenuItems — headerLink frontmatter override', () => {
	it('renders as direct link when root has headerLink: true, even with multiple children', () => {
		const root = node({
			path: '/lab',
			title: 'The Lab',
			icon: 'i-lucide-flask-conical',
			headerLink: true,
			children: [
				node({ path: '/lab/getting-started', title: 'Getting Started', icon: 'x' }),
				node({ path: '/lab/essentials', title: 'Essentials', icon: 'x' }),
				node({ path: '/lab/ai', title: 'AI', icon: 'x' }),
				node({ path: '/lab/installation', title: 'Installation', icon: 'x' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.to).toBe('/lab')
		expect(item.children).toBeUndefined()
	})

	it('still renders as dropdown when headerLink is undefined or false (default behavior)', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'x',
			children: [
				node({ path: '/syntax/git', title: 'Git', icon: 'x' }),
				node({ path: '/syntax/python', title: 'Python', icon: 'x' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.children).toHaveLength(2)
		expect(item.to).toBeUndefined()
	})
})

describe('buildHeaderMenuItems — active flag', () => {
	it('sets active=true when currentPath equals root.path', () => {
		const root = node({ path: '/lab', title: 'The Lab', icon: 'x' })
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/lab' })
		expect(item.active).toBe(true)
	})

	it('sets active=true when currentPath is a descendant of root.path', () => {
		const root = node({ path: '/syntax', title: 'Syntax', icon: 'x' })
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/syntax/git/branching' })
		expect(item.active).toBe(true)
	})

	it('does not set active when currentPath is unrelated', () => {
		const root = node({ path: '/lab', title: 'The Lab', icon: 'x' })
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/syntax' })
		expect(item.active).toBeFalsy()
	})

	it('does not set active for path-prefix-only matches without a slash boundary', () => {
		// `/labs` should not match `/lab`
		const root = node({ path: '/lab', title: 'The Lab', icon: 'x' })
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/labs' })
		expect(item.active).toBeFalsy()
	})
})

describe('buildHeaderMenuItems — frontmatter passthrough', () => {
	it('copies icon verbatim on root and on each child', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'i-heroicons-code-bracket',
			children: [
				node({ path: '/syntax/git', title: 'Git', icon: 'i-simple-icons-git', kind: 'chapter' }),
				node({ path: '/syntax/python', title: 'Python', icon: 'i-logos:python', kind: 'page' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.icon).toBe('i-heroicons-code-bracket')
		expect(item.children?.[0].icon).toBe('i-simple-icons-git')
		expect(item.children?.[1].icon).toBe('i-logos:python')
	})

	it('copies description verbatim when present', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'x',
			description: 'scripting languages',
			children: [
				node({ path: '/syntax/git', title: 'Git', icon: 'x', description: 'version control', kind: 'chapter' }),
				node({ path: '/syntax/python', title: 'Python', icon: 'x', description: 'scripting', kind: 'page' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item.description).toBe('scripting languages')
		expect(item.children?.[0].description).toBe('version control')
		expect(item.children?.[1].description).toBe('scripting')
	})

	it('omits description (does not emit empty string) when absent on source NavNode', () => {
		const root = node({
			path: '/syntax',
			title: 'Syntax',
			icon: 'x',
			children: [
				node({ path: '/syntax/git', title: 'Git', icon: 'x', kind: 'chapter' }),
				node({ path: '/syntax/python', title: 'Python', icon: 'x', kind: 'page' }),
			],
		})
		const [item] = buildHeaderMenuItems([root], { maxItems: 6, currentPath: '/' })
		expect(item).not.toHaveProperty('description')
		expect(item.children?.[0]).not.toHaveProperty('description')
		expect(item.children?.[1]).not.toHaveProperty('description')
	})
})
