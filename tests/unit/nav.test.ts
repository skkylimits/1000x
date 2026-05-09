import type { ContentPageLike } from '../../app/utils/nav'
import { describe, expect, it } from 'vitest'
import {
	buildTree,
	flattenForPrevNext,
	walkBreadcrumb,
	walkScope,
} from '../../app/utils/nav'

function page(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return {
		title: p.path.split('/').pop() ?? p.path,
		...p,
	}
}

function dir(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return page({ stem: 'index.md', ...p })
}

describe('buildTree — basic shape', () => {
	it('builds a parent directory with two child pages', () => {
		const tree = buildTree([
			dir({ path: '/javascript', title: 'JavaScript', icon: 'simple-icons:javascript', scope: 'self' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/javascript/functions', stem: 'functions.md', title: 'Functions' }),
		])

		const js = tree.lookup.get('/javascript')
		expect(js).toBeDefined()
		expect(js?.title).toBe('JavaScript')
		expect(js?.children.map(c => c.slug)).toEqual(['closures', 'functions'])
	})

	it('hoists index.md into the directory node and does not list it as a child', () => {
		const tree = buildTree([
			dir({ path: '/javascript', title: 'JavaScript', description: 'JS scope', icon: 'simple-icons:javascript', scope: 'self' }),
			page({ path: '/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])

		const js = tree.lookup.get('/javascript')
		expect(js?.children).toHaveLength(1)
		expect(js?.children[0]?.path).toBe('/javascript/closures')
		expect(js?.description).toBe('JS scope')
		expect(js?.meta.isDirectory).toBe(true)
		expect(js?.children.find(c => c.path === '/javascript')).toBeUndefined()
	})

	it('populates the flat lookup with every node keyed by path', () => {
		const tree = buildTree([
			dir({ path: '/learn', title: 'Learn', icon: 'i:learn', scope: 'self' }),
			dir({ path: '/learn/js', title: 'JS', icon: 'i:js' }),
			page({ path: '/learn/js/closures', stem: 'closures.md', title: 'Closures' }),
		])

		expect([...tree.lookup.keys()].sort()).toEqual(['/learn', '/learn/js', '/learn/js/closures'])
		expect(tree.lookup.get('/learn/js/closures')?.title).toBe('Closures')
		expect(tree.lookup.get('/learn/js')?.title).toBe('JS')
	})
})

describe('buildTree — order resolver', () => {
	it('respects an explicit nav array on the directory index.md', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self', nav: ['b', 'a', 'c'] }),
			page({ path: '/js/a', stem: 'a.md', title: 'A' }),
			page({ path: '/js/b', stem: 'b.md', title: 'B' }),
			page({ path: '/js/c', stem: 'c.md', title: 'C' }),
		])

		expect(tree.lookup.get('/js')?.children.map(c => c.slug)).toEqual(['b', 'a', 'c'])
	})

	it('places slugs not in the nav array at the tail in alphabetical order', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self', nav: ['a'] }),
			page({ path: '/js/c', stem: 'c.md', title: 'C' }),
			page({ path: '/js/b', stem: 'b.md', title: 'B' }),
			page({ path: '/js/a', stem: 'a.md', title: 'A' }),
		])

		expect(tree.lookup.get('/js')?.children.map(c => c.slug)).toEqual(['a', 'b', 'c'])
	})

	it('falls back to order: N when no nav array is set', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/x', stem: 'x.md', title: 'X', order: 2 }),
			page({ path: '/js/y', stem: 'y.md', title: 'Y', order: 1 }),
			page({ path: '/js/z', stem: 'z.md', title: 'Z', order: 3 }),
		])

		expect(tree.lookup.get('/js')?.children.map(c => c.slug)).toEqual(['y', 'x', 'z'])
	})

	it('falls back to alphabetical title when neither nav nor order is set', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/js/async', stem: 'async.md', title: 'Async' }),
			page({ path: '/js/modules', stem: 'modules.md', title: 'Modules' }),
		])

		expect(tree.lookup.get('/js')?.children.map(c => c.title)).toEqual(['Async', 'Closures', 'Modules'])
	})
})

describe('buildTree — variant collapse', () => {
	it('collapses three sibling variant files into one node with meta.variants', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.junior.nl.md', title: 'Closures (junior)' }),
			page({ path: '/js/closures', stem: 'closures.mid.nl.md', title: 'Closures (mid)' }),
			page({ path: '/js/closures', stem: 'closures.senior.nl.md', title: 'Closures (senior)' }),
		])

		const js = tree.lookup.get('/js')
		expect(js?.children).toHaveLength(1)
		const closures = js?.children[0]
		expect(closures?.slug).toBe('closures')
		expect(closures?.meta.variants).toEqual(['junior', 'mid', 'senior'])
	})

	it('uses the page that declares variants: [...] as canonical', () => {
		const variants = [
			{ id: 'junior', label: 'Junior', icon: 'i:j' },
			{ id: 'mid', label: 'Mid', icon: 'i:m' },
			{ id: 'senior', label: 'Senior', icon: 'i:s' },
		]
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.mid.nl.md', title: 'Closures (mid)' }),
			page({ path: '/js/closures', stem: 'closures.senior.nl.md', title: 'Closures (senior)' }),
			page({ path: '/js/closures', stem: 'closures.junior.nl.md', title: 'Closures (junior)', icon: 'i:closures', variants }),
		])

		const closures = tree.lookup.get('/js')?.children[0]
		expect(closures?.title).toBe('Closures (junior)')
		expect(closures?.icon).toBe('i:closures')
		expect(closures?.meta.variants).toEqual(['junior', 'mid', 'senior'])
	})

	it('does not collapse pages with mismatched bases', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.junior.nl.md', title: 'Closures' }),
			page({ path: '/js/functions', stem: 'functions.junior.nl.md', title: 'Functions' }),
		])

		const js = tree.lookup.get('/js')
		expect(js?.children).toHaveLength(2)
		expect(js?.children.map(c => c.slug).sort()).toEqual(['closures', 'functions'])
	})
})

describe('buildTree — icon validation', () => {
	it('throws when a scope-label directory lacks an icon', () => {
		expect(() => buildTree([
			dir({ path: '/javascript', title: 'JavaScript', scope: 'self' }),
		])).toThrow(/icon/)
	})

	it('throws when a chapter directory (has child pages) lacks an icon', () => {
		expect(() => buildTree([
			dir({ path: '/js', title: 'JavaScript' }),
			page({ path: '/js/a', stem: 'a.md', title: 'A' }),
			page({ path: '/js/b', stem: 'b.md', title: 'B' }),
		])).toThrow(/icon/)
	})

	it('does not throw when a leaf page lacks an icon', () => {
		expect(() => buildTree([
			dir({ path: '/js', title: 'JavaScript', icon: 'i:js' }),
			page({ path: '/js/closures', stem: 'closures.md', title: 'Closures' }),
		])).not.toThrow()
	})

	it('includes the offending path in the error message', () => {
		expect(() => buildTree([
			dir({ path: '/javascript', title: 'JavaScript', scope: 'self' }),
		])).toThrow(/\/javascript/)
	})
})

describe('walkScope', () => {
	it('returns the directory whose index.md declares scope: self', () => {
		const tree = buildTree([
			dir({ path: '/syntax', title: 'Syntax', icon: 'i:syntax' }),
			dir({ path: '/syntax/javascript', title: 'JavaScript', icon: 'i:js', scope: 'self' }),
			page({ path: '/syntax/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])

		const result = walkScope('/syntax/javascript/closures', tree.lookup)
		expect(result?.path).toBe('/syntax/javascript')
	})

	it('walks past intermediate directories without scope', () => {
		const tree = buildTree([
			dir({ path: '/learn', title: 'Learn', icon: 'i:learn', scope: 'self' }),
			dir({ path: '/learn/js', title: 'JS', icon: 'i:js' }),
			dir({ path: '/learn/js/advanced', title: 'Advanced', icon: 'i:adv' }),
			page({ path: '/learn/js/advanced/closures', stem: 'closures.md', title: 'Closures' }),
		])

		const result = walkScope('/learn/js/advanced/closures', tree.lookup)
		expect(result?.path).toBe('/learn')
	})

	it('falls back to the top-level ancestor when no scope is declared', () => {
		const tree = buildTree([
			dir({ path: '/syntax', title: 'Syntax', icon: 'i:syntax' }),
			dir({ path: '/syntax/js', title: 'JS', icon: 'i:js' }),
			page({ path: '/syntax/js/closures', stem: 'closures.md', title: 'Closures' }),
		])

		const result = walkScope('/syntax/js/closures', tree.lookup)
		expect(result?.path).toBe('/syntax')
	})

	it('returns null for a route path not in the lookup', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.md', title: 'Closures' }),
		])

		expect(walkScope('/does-not-exist', tree.lookup)).toBe(null)
	})
})

describe('walkBreadcrumb', () => {
	it('returns root → ... → current for a known path', () => {
		const tree = buildTree([
			dir({ path: '/syntax', title: 'Syntax', icon: 'i:syntax' }),
			dir({ path: '/syntax/javascript', title: 'JavaScript', icon: 'i:js', scope: 'self' }),
			page({ path: '/syntax/javascript/closures', stem: 'closures.md', title: 'Closures' }),
		])

		const crumbs = walkBreadcrumb('/syntax/javascript/closures', tree.lookup)
		expect(crumbs.map(n => n.path)).toEqual([
			'/syntax',
			'/syntax/javascript',
			'/syntax/javascript/closures',
		])
	})

	it('returns an empty array for an unknown path', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
		])

		expect(walkBreadcrumb('/nope', tree.lookup)).toEqual([])
	})
})

describe('flattenForPrevNext', () => {
	it('respects the nav-array order across the flattened sequence', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self', nav: ['b', 'a'] }),
			page({ path: '/js/a', stem: 'a.md', title: 'A' }),
			page({ path: '/js/b', stem: 'b.md', title: 'B' }),
		])

		const flat = flattenForPrevNext(tree)
		const slugs = flat.map(n => n.slug)
		const ai = slugs.indexOf('a')
		const bi = slugs.indexOf('b')
		expect(ai).toBeGreaterThanOrEqual(0)
		expect(bi).toBeGreaterThanOrEqual(0)
		expect(bi).toBeLessThan(ai)
	})

	it('emits variant-collapsed nodes exactly once', () => {
		const tree = buildTree([
			dir({ path: '/js', title: 'JS', icon: 'i:js', scope: 'self' }),
			page({ path: '/js/closures', stem: 'closures.junior.nl.md', title: 'Closures' }),
			page({ path: '/js/closures', stem: 'closures.mid.nl.md', title: 'Closures' }),
			page({ path: '/js/closures', stem: 'closures.senior.nl.md', title: 'Closures' }),
		])

		const flat = flattenForPrevNext(tree)
		const closuresCount = flat.filter(n => n.slug === 'closures').length
		expect(closuresCount).toBe(1)
	})

	it('excludes pure scope-label directories that have no own content', () => {
		const tree = buildTree([
			dir({ path: '/modules', title: 'Modules', icon: 'i:modules', scope: 'self' }),
			page({ path: '/modules/foo', stem: 'foo.md', title: 'Foo' }),
		])

		const flat = flattenForPrevNext(tree)
		const paths = flat.map(n => n.path)
		expect(paths).not.toContain('/modules')
		expect(paths).toContain('/modules/foo')
	})
})
