import type { ContentPageLike, NavTree } from '~/utils/nav'

export async function useNavTree() {
	const { data } = await useAsyncData<NavTree>('nav-tree', async () => {
		const pages = await queryCollection('docs').all()
		return buildTree(pages as unknown as ContentPageLike[])
	})
	return data
}
