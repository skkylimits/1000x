<template>
	<UContainer>
		<UPage>
			<template #left>
				<UPageAside>
					<LayoutSectionSidebar />
				</UPageAside>
			</template>

			<slot />
		</UPage>
	</UContainer>
</template>
