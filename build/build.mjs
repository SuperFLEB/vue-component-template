"use strict";
import {copyFileSync, mkdirSync, existsSync, rmSync} from "node:fs";
import {execSync} from "child_process";
import exec from "./exec.mjs";
import {rm, home} from "./helpers.mjs";

const DEFAULT_BUILD = "app";
const builds = {
	"app": [
		{cmd: () => rm(home("dist")), title: 'Clean "dist" directory'},
		{cmd: "vue-tsc --b --noEmit", title: "Check TypeScript"},
		{cmd: "yarn", args: ["vite", "build"], title: "Vite build"},
		{cmd: "yarn", args: ["vue-tsc", "--b"], title: "Generate .d.ts files"},
		{cmd: "yarn", args: ["resolve-tspaths","-p","tsconfig.lib.json"], title: "Resolve TypeScript aliases in .d.ts files"},
		{cmd: "yarn", args: ["api-extractor","run","--local","--verbose","-c","api-extractor.jsonc"], title: "Create .d.ts rollup file"},
		{cmd: () => rm(home("dist/dts")), title: "Remove individual .d.ts files"}
	],
	"demo": [
		{cmd: () => rm(home("dist-demo")), title: 'Clean "dist-demo" directory'},
		{cmd: "yarn", args: ["vite", "build"], env: {...process.env, BUILD_TYPE: "demo"}},
	]
};

builds.release = [
	{cmd: "yarn", args: ["run", "test-ct"], msg: "Playwright Component Test"},
	...builds.app,
]

// --- 8< --------------------------------------------------------------------------------------------------------------
// No need to edit below this line.

process.chdir(home());
const whichBuild = process.argv[2] ?? DEFAULT_BUILD;
if (!builds[whichBuild]) throw new Error(`Build name ${whichBuild} is not valid.`);
console.log(`Building "${whichBuild}". Script contains ${builds[whichBuild].length} step(s).`);

(async () => {
	for (const [idx, command] of builds[whichBuild].entries()) {
		await exec(command, idx + 1, builds[whichBuild].length);
	}
})();

