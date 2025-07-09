import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import version from "@superfleb/vite-plugin-version/plugin";

import {globSync} from "tinyglobby";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const typeGlobs = ["./src/**/*.ts", "./src/**/*.tsx", "./src/**/*.vue", "./src/**/*.mjs", "./src/**/*.js"];

function globject(glob: string[]) {
	return Object.fromEntries(
		globSync(glob).map(file => [
			path.relative(
				"./src",
				file.slice(0, file.length - path.extname(file).length)
			).replace(/\\/, "/"),
			path.resolve(file)
		])
	);
}

const entries = globject(typeGlobs);
const CSS_NAME = "VectorDot";

export default defineConfig(() => (
	{
		appType: "mpa", // disable history fallback
		plugins: [
			version(),
			vue(),
			libInjectCss(),
		],
		build: {
			// assetsInlineLimit: 0,
			minify: true,
			sourcemap: true,
			target: "es2020",
			lib: {
				entry: entries,
				cssFileName: CSS_NAME,
				formats: ["es"],
				fileName: (format, entryName) => {
					const baseName = entryName.replace(/\.(vue|ts|tsx)$/, "");
					return `${format}/${baseName}.mjs`;
				},
				name: "VectorDot",
			},
			rollupOptions: {
				output: {
					chunkFileNames: (chunkInfo) => {
						const match = chunkInfo.moduleIds[0].match(/^(.+[/\\]([^?/\\]+))\.[^.?]*\?.*$/);
						if (!match) return chunkInfo.name + ".mjs";
						const outPath = path.relative("./src", match[1]);
						return outPath + ".mjs";
					},
					entryFileNames: `[name].mjs`,
					manualChunks: (id) => {
						const rel = path.relative(".", id);
						if (/^(\.?\/?)node_modules[\\/]/.test(rel)) {
							return rel.replace(/^node_modules/, "vendor");
						}
					}
				},
				external: ["vue"],
			}
		},
		resolve: {
			preserveSymlinks: true,
			alias: [
				{find: "@", replacement: path.resolve(__dirname, "./src")},
				{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
			],
		}
	})
);

