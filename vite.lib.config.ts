import * as path from "node:path";
import {libInjectCss} from "vite-plugin-lib-inject-css";
import {mergeConfig, UserConfig} from "vite";
import {globSync} from "tinyglobby";
import viteCommonConfig, {projectName} from "./vite.common.config";

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

const entries = globject(["./src/**/*.ts", "./src/**/*.tsx", "./src/**/*.vue", "./src/**/*.mjs", "./src/**/*.js"]);

export default mergeConfig(viteCommonConfig, {
	plugins: [libInjectCss()],
	build: {
		lib: {
			entry: entries,
			cssFileName: projectName,
			formats: ["es"],
			fileName: (format, entryName) => {
				const baseName = entryName.replace(/\.(vue|ts|tsx)$/, "");
				return `${format}/${baseName}.mjs`;
			},
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
	}
} as Partial<UserConfig>);

