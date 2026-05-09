import type { NavNode } from '~/utils/nav'

export async function usePrevNext() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<{ prev: NavNode | null, next: NavNode | null }>(() => {
		if (!tree.value)
			return { prev: null, next: null }
		const flat = flattenForPrevNext(tree.value)
		const i = flat.findIndex(n => n.path === route.path)
		if (i < 0)
			return { prev: null, next: null }
		return {
			prev: i > 0 ? flat[i - 1]! : null,
			next: i < flat.length - 1 ? flat[i + 1]! : null,
		}
	})
}
