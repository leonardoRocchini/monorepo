import { search } from "#src/services/search/index.js"
import { render } from "vike/abort"

export default async function onBeforeRender(pageContext: any) {
	const { q } = pageContext.urlParsed.search
	const { category } = pageContext.routeParams

	const categoryValue = (() => {
		switch (category) {
			case "apps":
				return "app"
			case "guides":
				return "guide"
			case "plugins":
				return "plugin"
			case "lint-rules":
				return "messageLintRule"
			case "libraries":
				return "library"
			default:
				return undefined
		}
	})()

	const results = await search({
		term: category,
		category: categoryValue,
	})

	const items = JSON.parse(results.data as string).map((item: any) => {
		item.uniqueID = item.objectID
		delete item.readme
		delete item.objectID
		return item
	})

	if (!q && items.length === 0) {
		throw render(404)
	}

	return {
		pageContext: {
			pageProps: {
				items: items,
			},
		},
	}
}
