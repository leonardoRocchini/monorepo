import { compileMessage } from "./compileMessage.js"
import dedent from "dedent"
import type { Message, ProjectSettings } from "@inlang/sdk"

/**
 * Heads up for developers that a file is automatically generated.
 */
const thisIsACompiledFileComment = dedent`
/**
 * !This file is automatically generated by the inlang paraglide-js compiler!
 */
`

/**
 * A compile function takes a list of messages and project settings and returns
 * a map of file names to file contents.
 *
 * @example
 *   const output = compile({ messages, settings })
 *   console.log(output)
 *   >> { "messages.js": "...", "runtime.js": "..." }
 */
export const compile = (args: {
	messages: Readonly<Message[]>
	settings: ProjectSettings
}): Record<string, string> => {
	const compiledMessages = args.messages.map(compileMessage).join("\n\n")

	return {
		// for unknown reasons, typescript needs dedicated .d.ts files and
		// the d.ts files cannot shadow the js files. Hence, the _ prefix.
		"runtime$.d.ts": `export * from "./runtime.js"`,
		"messages$.d.ts": `export * from "./messages.js"`,
		"messages.js": dedent`
${thisIsACompiledFileComment}

import { languageTag } from "./runtime.js"

${compiledMessages}
`,
		"runtime.js": dedent`
${thisIsACompiledFileComment}


/** @type {((tag: AvailableLanguageTag) => void) | undefined} */ 
let _onSetLanguageTag

/**
 * The project's source language tag.
 * 
 * @example
 *   if (newlySelectedLanguageTag === sourceLanguageTag){
 *     // do nothing as the source language tag is the default language
 *     return
 *   }
 */
export const sourceLanguageTag = "${args.settings.sourceLanguageTag}"

/**
 * The project's available language tags.
 * 
 * @example 
 *   if (availableLanguageTags.includes(userSelectedLanguageTag) === false){
 *     throw new Error("Language tag not available")
 *   }
 */
export const availableLanguageTags = /** @type {const} */ (${JSON.stringify(
			args.settings.languageTags
		)})

/**
 * Get the current language tag.
 * 
 * @example
 *   if (languageTag() === "de"){
 *     console.log("Germany 🇩🇪")
 *   } else if (languageTag() === "nl"){
 *     console.log("Netherlands 🇳🇱")
 *   }
}
 * 
 * @type {() => AvailableLanguageTag}
 */
export let languageTag = () => sourceLanguageTag

/**
 * Set the language tag.
 * 
 * @example 
 * 
 *   // changing to language 
 *   setLanguageTag("en")
 * 
 *   // passing a getter function also works. 
 *   // 
 *   // a getter function is useful for resolving a language tag 
 *   // on the server where every request has a different language tag
 *   setLanguageTag(() => {
 *     return request.langaugeTag
 *   }) 
 *
 * @param {AvailableLanguageTag | (() => AvailableLanguageTag)} tag
 */
export const setLanguageTag = (tag) => {
	if (typeof tag === "function") {
		languageTag = tag
	} else {
		languageTag = () => tag
	}
	// call the callback function if it has been defined
	if (_onSetLanguageTag !== undefined) {
		_onSetLanguageTag(languageTag())
	}
}

/**
 * Set the \`onSetLanguageTag()\` callback function.
 *
 * The function can be used to trigger client-side side-effects such as 
 * making a new request to the server with the updated language tag, 
 * or re-rendering the UI on the client (SPA apps).  
 * 
 * - Don't use this function on the server (!).
 *   Triggering a side-effect is only useful on the client because a server-side
 *   environment doesn't need to re-render the UI. 
 *     
 * - The \`onSetLanguageTag()\` callback can only be defined once to avoid unexpected behavior.
 * 
 * @example
 *   // if you use inlang paraglide on the server, make sure 
 *   // to not call \`onSetLanguageTag()\` on the server
 *   if (isServer === false) {
 *     onSetLanguageTag((tag) => {
 *       // (for example) make a new request to the 
 *       // server with the updated language tag
 *       window.location.href = \`/\${tag}/\${window.location.pathname}\`
 *     })
 *   }
 *
 * @param {(languageTag: AvailableLanguageTag) => void} fn
 */
export const onSetLanguageTag = (fn) => {
	if (_onSetLanguageTag !== undefined) {
		throw new Error("@inlang/paraglide-js: The \`onSetLanguageTag()\` callback has already been defined.\\n\\nThe \`onSetLanguageTag()\` callback can only be defined once to avoid unexpected behavior.\\n\\n 1) Try searching for \`onSetLanguageTag()\` in your codebase for potential duplicated.\\n 2) It might be that your framework is calling \`onSetLanguageTag()\` multiple times. Try to move the \`onSetLanguageTag()\` out of the rendering scope like a React component.")
	}
	_onSetLanguageTag = fn
}

// ------ TYPES ------

/**
 * A language tag that is available in the project.
 * 
 * @example
 *   setLanguageTag(request.languageTag as AvailableLanguageTag)
 * 
 * @typedef {typeof availableLanguageTags[number]} AvailableLanguageTag
 */
`,
	}
}
