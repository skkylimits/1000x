import type { ContentPageLike } from '../../app/utils/nav'
import { describe, expect, it } from 'vitest'
import {
	buildTree,
	walkBreadcrumb,
	walkEffectiveScope,
	walkScope,
} from '../../app/utils/nav'

function page(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return {
		...p,
		title: p.title ?? p.path.split('/').pop() ?? p.path,
	}
}

function dir(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return page({ stem: 'index.md', ...p })
}

describe('buildTree — basic shape', () => {
	it('builds a parent directory with two child pages', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/javascript/functions', stem: 'functions.md', title: 'Functions' }),
		])
		const js = tree.lookup.get('/javascript')!
		expect(js.title).toBe('JavaScript')
		expect(js.children.map(c => c.slug)).toEqual(['closures', 'functions'])
	})

	it('hoists index.md into the directory node and does not list it as a child', () => {
		const tree = buildTree([
			dir({ description: 'JS docs', icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const js = tree.lookup.get('/javascript')!
		expect(js.description).toBe('JS docs')
		expect(js.children).toHaveLength(1)
		expect(js.children.map(c => c.slug)).toEqual(['closures'])
	})

	it('populates the flat lookup with every node keyed by path', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/javascript/functions', stem: 'functions.md', title: 'Functions' }),
		])
		expect(tree.lookup.has('/javascript')).toBe(true)
		expect(tree.lookup.has('/javascript/closures')).toBe(true)
		expect(tree.lookup.has('/javascript/functions')).toBe(true)
		expect(tree.lookup.get('/javascript/closures')!.path).toBe('/javascript/closures')
	})
})

describe('buildTree — order resolver', () => {
	it('respects an explicit nav array on the directory index.md', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', nav: ['b', 'a', 'c'], path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/a', stem: 'a.md', title: 'A' }),
			page({ path: '/javascript/b', stem: 'b.md', title: 'B' }),
			page({ path: '/javascript/c', stem: 'c.md', title: 'C' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['b', 'a', 'c'])
	})

	it('places slugs not in the nav array at the tail in alphabetical order', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', nav: ['a'], path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/a', stem: 'a.md', title: 'A' }),
			page({ path: '/javascript/b', stem: 'b.md', title: 'B' }),
			page({ path: '/javascript/c', stem: 'c.md', title: 'C' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['a', 'b', 'c'])
	})

	it('falls back to order: N when no nav array is set', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ order: 2, path: '/javascript/x', stem: 'x.md', title: 'X' }),
			page({ order: 1, path: '/javascript/y', stem: 'y.md', title: 'Y' }),
			page({ order: 3, path: '/javascript/z', stem: 'z.md', title: 'Z' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['y', 'x', 'z'])
	})

	it('falls back to alphabetical title when neither nav nor order is set', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/javascript/async', stem: 'async.md', title: 'Async' }),
			page({ path: '/javascript/modules', stem: 'modules.md', title: 'Modules' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.title)).toEqual(['Async', 'Closures', 'Modules'])
	})

	it('respects nav over the levels: [...] array on a levels-container', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: ['junior', 'mid', 'senior'], nav: ['senior', 'mid', 'junior'], path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
			dir({ icon: 'lucide:user-check', path: '/javascript/mid', title: 'Mid' }),
			dir({ icon: 'lucide:crown', path: '/javascript/senior', title: 'Senior' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['senior', 'mid', 'junior'])
	})

	it('uses the levels: [...] array order when no nav is set', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: ['senior', 'mid', 'junior'], path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
			dir({ icon: 'lucide:user-check', path: '/javascript/mid', title: 'Mid' }),
			dir({ icon: 'lucide:crown', path: '/javascript/senior', title: 'Senior' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['senior', 'mid', 'junior'])
	})

	it('falls back to alphabetical level-slug when levels: true (no array) is set', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:crown', path: '/javascript/senior', title: 'Senior' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
			dir({ icon: 'lucide:user-check', path: '/javascript/mid', title: 'Mid' }),
		])
		expect(tree.lookup.get('/javascript')!.children.map(c => c.slug)).toEqual(['junior', 'mid', 'senior'])
	})

	it('respects nav over the tabs: [...] array on a tabs-container', () => {
		const tree = buildTree([
			dir({ icon: 'lucide:download', nav: ['cli', 'postcss', 'vite'], path: '/install', scope: 'self', tabs: ['vite', 'postcss', 'cli'], title: 'Install' }),
			page({ path: '/install/vite', stem: 'vite.md', title: 'Vite' }),
			page({ path: '/install/postcss', stem: 'postcss.md', title: 'PostCSS' }),
			page({ path: '/install/cli', stem: 'cli.md', title: 'CLI' }),
		])
		expect(tree.lookup.get('/install')!.children.map(c => c.slug)).toEqual(['cli', 'postcss', 'vite'])
	})
})

describe('buildTree — kind detection', () => {
	it('marks a levels-container directory and its level children', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
			page({ path: '/javascript/junior/closures', stem: 'closures.md', title: 'Closures' }),
		])
		expect(tree.lookup.get('/javascript')!.meta.kind).toBe('levels-container')
		expect(tree.lookup.get('/javascript/junior')!.meta.kind).toBe('level')
		expect(tree.lookup.get('/javascript/junior/closures')!.meta.kind).toBe('page')
	})

	it('marks a tabs-container directory and its tab children', () => {
		const tree = buildTree([
			dir({ icon: 'lucide:download', path: '/install', scope: 'self', tabs: true, title: 'Install' }),
			page({ path: '/install/vite', stem: 'vite.md', title: 'Vite' }),
			page({ path: '/install/cli', stem: 'cli.md', title: 'CLI' }),
		])
		expect(tree.lookup.get('/install')!.meta.kind).toBe('tabs-container')
		expect(tree.lookup.get('/install/vite')!.meta.kind).toBe('tab')
		expect(tree.lookup.get('/install/cli')!.meta.kind).toBe('tab')
	})

	it('marks a directory with child pages and no levels/tabs flag as chapter', () => {
		const tree = buildTree([
			dir({ icon: 'lucide:book', path: '/intro', title: 'Intro' }),
			page({ path: '/intro/welcome', stem: 'welcome.md', title: 'Welcome' }),
		])
		expect(tree.lookup.get('/intro')!.meta.kind).toBe('chapter')
	})

	it('marks a leaf page as page', () => {
		const tree = buildTree([
			page({ path: '/standalone', stem: 'standalone.md', title: 'Standalone' }),
		])
		expect(tree.lookup.get('/standalone')!.meta.kind).toBe('page')
	})
})

describe('buildTree — icon validation', () => {
	it('throws when a scope-label directory lacks an icon', () => {
		expect(() => buildTree([
			dir({ path: '/javascript', scope: 'self', title: 'JavaScript' }),
		])).toThrow(/icon/)
	})

	it('throws when a chapter directory (has child pages) lacks an icon', () => {
		expect(() => buildTree([
			dir({ path: '/intro', title: 'Intro' }),
			page({ path: '/intro/welcome', stem: 'welcome.md', title: 'Welcome' }),
			page({ path: '/intro/about', stem: 'about.md', title: 'About' }),
		])).toThrow(/icon/)
	})

	it('throws when a level node lacks an icon', () => {
		expect(() => buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ path: '/javascript/junior', title: 'Junior' }),
		])).toThrow(/icon/)
	})

	it('does not throw when a leaf page lacks an icon', () => {
		expect(() => buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])).not.toThrow()
	})

	it('includes the offending path in the error message', () => {
		expect(() => buildTree([
			dir({ path: '/javascript', scope: 'self', title: 'JavaScript' }),
		])).toThrow(/\/javascript/)
	})
})

describe('buildTree — flag conflict', () => {
	it('throws when a directory declares both levels and tabs', () => {
		expect(() => buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', tabs: true, title: 'JavaScript' }),
		])).toThrow(/\/javascript/)
	})
})

describe('walkScope', () => {
	it('returns the directory whose index.md declares scope: self', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const result = walkScope('/javascript/closures', tree.lookup)
		expect(result?.path).toBe('/javascript')
	})

	it('walks past intermediate directories without scope', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:zap', path: '/javascript/advanced', title: 'Advanced' }),
			page({ path: '/javascript/advanced/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const result = walkScope('/javascript/advanced/closures', tree.lookup)
		expect(result?.path).toBe('/javascript')
	})

	it('falls back to the top-level ancestor when no scope is declared', () => {
		const tree = buildTree([
			dir({ icon: 'lucide:book', path: '/intro', title: 'Intro' }),
			page({ path: '/intro/welcome', stem: 'welcome.md', title: 'Welcome' }),
		])
		const result = walkScope('/intro/welcome', tree.lookup)
		expect(result?.path).toBe('/intro')
	})

	it('returns null for a route path not in the lookup', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
		])
		const result = walkScope('/does-not-exist', tree.lookup)
		expect(result).toBeNull()
	})
})

describe('walkEffectiveScope', () => {
	it('returns the active level when the resolved scope is a levels-container', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
			page({ path: '/javascript/junior/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const result = walkEffectiveScope('/javascript/junior/closures', tree.lookup)
		expect(result?.path).toBe('/javascript/junior')
		expect(result?.meta.kind).toBe('level')
	})

	it('returns the same node as walkScope for a regular scope', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const route = '/javascript/closures'
		expect(walkEffectiveScope(route, tree.lookup)).toBe(walkScope(route, tree.lookup))
	})

	it('returns the levels-container itself when the route is the container index.md', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', levels: true, path: '/javascript', scope: 'self', title: 'JavaScript' }),
			dir({ icon: 'lucide:user-round', path: '/javascript/junior', title: 'Junior' }),
		])
		const result = walkEffectiveScope('/javascript', tree.lookup)
		expect(result?.path).toBe('/javascript')
		expect(result?.meta.kind).toBe('levels-container')
	})
})

describe('walkBreadcrumb', () => {
	it('returns root → ... → current for a known path', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])
		const result = walkBreadcrumb('/javascript/closures', tree.lookup)
		expect(result.map(n => n.path)).toEqual(['/javascript', '/javascript/closures'])
	})

	it('returns an empty array for an unknown path', () => {
		const tree = buildTree([
			dir({ icon: 'simple-icons:javascript', path: '/javascript', scope: 'self', title: 'JavaScript' }),
		])
		const result = walkBreadcrumb('/nope', tree.lookup)
		expect(result).toEqual([])
	})
})
