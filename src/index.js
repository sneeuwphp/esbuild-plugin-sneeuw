import { readFileSync } from "fs";
import babel from "@babel/core";
import injectSourcePathPlugin from "./injectSourcePathPlugin.js";
import jsxPlugin from "@babel/plugin-syntax-jsx";

const plugin = {
	name: "sneeuw",
	setup(build) {
		build.onLoad({ filter: /\.ski$/ }, async ({ path }) => {
			let contents = readFileSync(path, "utf8");
			contents = contents.includes("---") ? contents.split("---")[1] : contents;

			contents = babel.transformSync(contents, {
				filename: path,
				plugins: [injectSourcePathPlugin, jsxPlugin],
			}).code;

			return { contents, loader: "jsx" };
		});
	},
};

export default plugin;
