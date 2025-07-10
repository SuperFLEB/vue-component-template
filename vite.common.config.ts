import version from "@superfleb/vite-plugin-version/plugin";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

/* This is a partial configuration with common options. It should be merged with a more specific configuration */

export const projectName = "VueComponentTemplateSampleProject";

export default {
	base: "./",
	plugins: [
		version(),
		vue()
	],
	build: {
		assetsInlineLimit: 0,
		minify: true,
		sourcemap: true,
		target: "es2020",
	},
	resolve: {
		preserveSymlinks: true,
		alias: [
			{find: "@", replacement: path.resolve(__dirname, "./src")},
			{find: "@exp", replacement: path.resolve(__dirname, "./src/exported")},
			{find: "@apps", replacement: path.resolve(__dirname, "./src/apps")},
			{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
			{find: "@themes", replacement: path.resolve(__dirname, "./src/themes")},
		],
	}
};