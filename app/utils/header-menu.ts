import type { NavigationMenuItem } from '@nuxt/ui'
import type { NavNode } from './nav'

export interface BuildHeaderMenuOptions {
	maxItems: number
	currentPath: string
}

function isActive(rootPath: string, currentPath: string): boolean {
	return currentPath === rootPath || currentPath.startsWith(`${rootPath}/`)
}

function mapChild(child: NavNode): NavigationMenuItem {
	const item: NavigationMenuItem = {
		label: child.title,
		icon: child.icon,
		to: child.path,
	}
	if (child.description !== undefined)
		item.description = child.description
	return item
}

function mapRoot(root: NavNode, currentPath: string): NavigationMenuItem {
	// All children are surfaced in the header dropdown — including levels-container and
	// tabs-container nodes. Those kinds matter for sidebar/level-header rendering but
	// not for the top-level menu: at the menu level, a levels-container is just a
	// navigable topic landing page.
	const children = root.children
	const active = isActive(root.path, currentPath)

	const item: NavigationMenuItem = {
		label: root.title,
		icon: root.icon,
	}
	if (children.length >= 2)
		item.children = children.map(mapChild)
	else
		item.to = root.path
	if (root.description !== undefined)
		item.description = root.description
	if (active) {
		item.active = true
		// Active-state underline: 2px bar that lands on the header's bottom divider.
		// Anchored via the Reka UI wrapper-h-full fix in AppHeader.vue's scoped style;
		// without that fix the link's intrinsic height < header height would leave whitespace.
		item.class = 'after:absolute after:left-2.5 after:right-2.5 after:-bottom-[16px] after:h-0.5 after:bg-primary after:content-[\'\']'
	}
	return item
}

export function buildHeaderMenuItems(
	roots: NavNode[],
	opts: BuildHeaderMenuOptions,
): NavigationMenuItem[] {
	return roots.slice(0, opts.maxItems).map(r => mapRoot(r, opts.currentPath))
}
