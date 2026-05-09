import type { NavNode } from '~/utils/nav'

export async function useBreadcrumb() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<NavNode[]>(() => {
		if (!tree.value)
			return []
		return walkBreadcrumb(route.path, tree.value.lookup)
	})
}
