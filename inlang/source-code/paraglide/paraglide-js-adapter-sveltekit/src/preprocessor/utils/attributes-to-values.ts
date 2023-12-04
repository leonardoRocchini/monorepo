import type { AttributeValue } from "../types.js"

/**
 * Takes in an AST of an AttributeValue and returns JS code that evaluates to the same value.
 * @param values - An array of AttributeValues
 * @param originalCode - The original code that the AST was parsed from, neede to sample the expression code
 * @returns A JS expression that evaluates to the same value as the AttributeValue
 */
export function attrubuteValuesToJSValue(values: AttributeValue[], originalCode: string): string {
	let templateString = "`"

	for (const value of values) {
		switch (value.type) {
			case "Text":
				templateString += escapeStringLiteral(value.data)
				break
			case "MustacheTag": {
				const expressionCode = originalCode.slice(value.expression.start, value.expression.end)
				templateString += "${"
				templateString += expressionCode
				templateString += "}"
				break
			}
		}
	}

	templateString += "`"
	return templateString
}

function escapeStringLiteral(string: string) {
	return string.replace(/`/g, "\\`").replace(/\$/g, "\\$")
}