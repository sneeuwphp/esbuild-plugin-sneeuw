import { readFileSync } from "fs";
import type { Plugin } from "esbuild";

const plugin: Plugin = {
	name: "sneeuw",
	setup(build) {
		build.onLoad({ filter: /\.ski$/ }, async ({ path }) => {
			const contents = readFileSync(path, "utf8");
			const jsCode = contents.includes("---")
				? contents.split("---")[1]
				: contents;

			return {
				contents: jsCode,
				loader: "jsx",
			};
		});
	},
};

export default plugin;
