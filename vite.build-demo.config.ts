import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
	plugins: [vue()],
	base: "./",
	build: {
		assetsInlineLimit: 0,
		outDir: "./dist-demo/",
		minify: true,
		target: "es2020",
		rollupOptions: {
			input: "./index.html",
		}
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
	},
});
