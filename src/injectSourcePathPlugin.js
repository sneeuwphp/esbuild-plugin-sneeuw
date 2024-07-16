import { createHash } from "crypto";
import path from "path";

export default ({ types: t }) => {
	return {
		visitor: {
			Program(elementPath, state) {
				state.imports = {};

				elementPath.traverse({
					ImportDeclaration(importPath) {
						const source = importPath.node.source.value;
						importPath.node.specifiers.forEach((specifier) => {
							const importedName = specifier.local.name;
							state.imports[importedName] = source;
						});
					},
				});
			},
			JSXElement(elementPath, state) {
				const elementName = elementPath.node.openingElement.name.name;

				if (elementName.charAt(0) === elementName.charAt(0).toUpperCase()) {
					const pathFromSrc = path
						.relative(
							process.cwd() + "/src",
							path.resolve(
								path.dirname(state.file.opts.filename),
								state.imports[elementName],
							),
						)
						.replace(/\.[^/.]+$/, "");

					const hash = createHash("md5")
						.update(`/${pathFromSrc}`)
						.digest("hex");

					elementPath.node.openingElement.attributes.push(
						t.jsxAttribute(t.jsxIdentifier("__source"), t.stringLiteral(hash)),
					);
				}
			},
		},
	};
};
