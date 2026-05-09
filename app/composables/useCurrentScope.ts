import type { NavNode } from '~/utils/nav'

export async function useCurrentScope() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<NavNode | null>(() => {
		if (!tree.value)
			return null
		return walkScope(route.path, tree.value.lookup)
	})
}
