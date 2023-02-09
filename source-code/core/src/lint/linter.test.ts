import { describe, test } from "vitest";
import type { Config } from '../config/schema.js';
import { lint } from './linter.js';
import { inspect } from 'util';
import type { LintRuleInit, Reporter } from './schema.js';

const debug = (element: unknown) => console.info(inspect(element, false, 999))

const missingKeyRule = (() => {
	let reporter: Reporter
	let referenceLanguage: string

	return {
		id: 'missingKey',
		initialize: (config) => {
			reporter = config.reporter
			referenceLanguage = config.referenceLanguage
		},
		visitors: {
			Resource: {
				enter: ({ target }) => {
					if (target && target.languageTag.name === referenceLanguage) return 'skip'
				},
			},
			Message: {
				enter: ({ target, reference }) => {
					if (!target && reference) {
						reporter.reportError(reference, `Message with id '${reference.id.name}' missing`)
					}
				},
			},
		},
	}
}) satisfies LintRuleInit

const additionalKeyRule = (() => {
	let reporter: Reporter
	let referenceLanguage: string

	return {
		id: 'additionalKey',
		initialize: (config) => {
			reporter = config.reporter
			referenceLanguage = config.referenceLanguage
		},
		visitors: {
			Resource: {
				enter: ({ target }) => {
					if (target && target.languageTag.name === referenceLanguage) return 'skip'
				},
			},
			Message: {
				enter: ({ target, reference }) => {
					if (!reference && target) {
						reporter.reportError(target, `Message with id '${target.id.name}' is specified, mut missing in the reference`)
					}
				},
			},
		},
	}
}) satisfies LintRuleInit

const dummyConfig = {
	referenceLanguage: 'en',
	languages: ['en', 'de'],
	readResources: async () => {
		return [{
			type: "Resource",
			languageTag: {
				type: "LanguageTag",
				name: "en",
			},
			body: [
				{
					type: "Message",
					id: { type: "Identifier", name: "first-message" },
					pattern: {
						type: "Pattern",
						elements: [{ type: "Text", value: "Welcome to this app." }],
					},
				}
			],
		},
		{
			type: "Resource",
			languageTag: {
				type: "LanguageTag",
				name: "de",
			},
			body: [
				{
					type: "Message",
					id: { type: "Identifier", name: "second-message" },
					pattern: {
						type: "Pattern",
						elements: [{ type: "Text", value: "Test" }],
					},
				}
			],
		}]
	},
	writeResources: async () => undefined,
	lint: {
		rules: [
			missingKeyRule(),
			additionalKeyRule(),
		],
	}
} satisfies Config

describe("lint", () => {
	describe("rules", async () => {
		test("should not start linting if no rules are specified", async () => {

		})

		test("should process all resources", async () => {

		})

		test("should process all resources for all rules", async () => {

		})
	})

	describe("initialize", async () => {
		test("should call 'initialize' with all params", async () => {

		})
	})

	describe("teardown", async () => {
		test("should call 'teardown' if present", async () => {

		})

	})

	describe("visitors", () => {
		test("should visit all nodes exactly once", async () => {

		})

		describe("should await", async () => {
			describe("'Resource'", async () => {
				test("'enter'", async () => {

				})

				test("'leave'", async () => {

				})
			})

			describe("'Message'", async () => {
				test("'enter'", async () => {

				})

				test("'leave'", async () => {

				})
			})

			describe("'Pattern'", async () => {
				test("'enter'", async () => {

				})

				test("'leave'", async () => {

				})
			})
		})

		describe("should skip processing children", async () => {
			describe("if no visitor is specified", async () => {
				describe("for 'Resource'", async () => {
					test("node", async () => {

					})

					describe("but not if children has visitor specified", async () => {
						test("for Message", async () => {

						})

						test("for Pattern", async () => {

						})
					})
				})

				describe("for Message", async () => {
					test("node", async () => {

					})

					describe("but not if children has visitor specified", async () => {
						test("for Pattern", async () => {

						})
					})
				})

				describe("for Pattern", async () => {
					test("node", async () => {

					})
				})
			})

			describe("if 'skip' get's returned by a visitor", async () => {
				test("for 'Resource'", async () => {

				})

				test("for 'Message'", async () => {

				})

				test("for 'Pattern'", async () => {

				})
			})
		})
	})

	describe("reporter", async () => {
		test("should leave original resources untouched and operate on a copy", async () => {

		})

		describe("should attach 'lint' attribute", async () => {
			describe("to 'Resource' node", async () => {
				test("as 'error'", async () => {

				})

				test("as 'warning'", async () => {

				})
			})

			describe("to 'Message' node", async () => {
				test("as 'error'", async () => {

				})

				test("as 'warning'", async () => {

				})
			})

			describe("to 'Pattern' node", async () => {
				test("as 'error'", async () => {

				})

				test("as 'warning'", async () => {

				})
			})
		})
	})

	describe("exceptions", async () => {
		describe("should not kill process", async () => {
			test("if 'teardown' is not present", async () => {

			})

			describe("in 'Resource'", async () => {
				test("if 'enter' is not present", async () => {

				})

				test("if 'leave' is not present", async () => {

				})
			})

			describe("in 'Message'", async () => {
				test("if 'enter' is not present", async () => {

				})

				test("if 'leave' is not present", async () => {

				})
			})

			describe("in 'Pattern'", async () => {
				test("if 'enter' is not present", async () => {

				})

				test("if 'leave' is not present", async () => {

				})
			})

			describe("if visitor throws", async () => {
				describe("in 'Resource'", async () => {
					test("'enter'", async () => {

					})

					test("'leave'", async () => {

					})
				})

				describe("in 'Message'", async () => {
					test("'enter'", async () => {

					})

					test("'leave'", async () => {

					})
				})

				describe("in 'Pattern'", async () => {
					test("'enter'", async () => {

					})

					test("'leave'", async () => {

					})
				})
			})

			describe("if node gets passed to the reporter `Reporter`", async () => {
				test("for 'error'", async () => {

				})

				test("for 'warning'", async () => {

				})
			})
		})
	})

	describe("payloads", async () => {
		describe("should receive the payload", async () => {
			describe("in teardown", async () => {
				test("from the 'initialize' function", async () => {

				})
			})
		})

		// test pass copy instead of object reference
		// test altering payloads
		// test not returning payloads
	})
})