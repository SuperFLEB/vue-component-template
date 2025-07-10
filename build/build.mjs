"use strict";
import {copyFileSync, mkdirSync, existsSync, rmSync} from "node:fs";
import {execSync} from "child_process";
import {rm, home, execAll} from "./helpers.mjs";

const DEFAULT_BUILD = "app";
const builds = {
	"app": [
		{cmd: () => rm(home("dist")), msg: 'Clean "dist" directory'},
		{cmd: "yarn vue-tsc --b --noEmit", msg: "Check TypeScript"},
		{cmd: "yarn vite build", msg: "Vite build"},
		{cmd: "yarn vue-tsc --b", msg: "Generate .d.ts files"},
		{cmd: "resolve-tspaths -p tsconfig.lib.json", msg: "Resolve TypeScript aliases in .d.ts files"},
		{cmd: "api-extractor run --local --verbose -c api-extractor.jsonc", msg: "Create .d.ts rollup file"},
		{cmd: () => rm(home("dist/dts")), msg: "Remove individual .d.ts files"}
	],
	"demo": [
		{cmd: () => rm(home("dist-demo")), msg: 'Clean "dist-demo" directory'},
		{cmd: "yarn vite build", env: {BUILD_TYPE: "demo"}},
	]
};

builds.release = [
	{cmd: "yarn run test-ct", msg: "Playwright Component Test"},
	...builds.app,
]

// --- 8< --------------------------------------------------------------------------------------------------------------
// No need to edit below this line.

process.chdir(home());
const whichBuild = process.argv[2] ?? DEFAULT_BUILD;
if (!builds[whichBuild]) throw new Error(`Build name ${whichBuild} is not valid.`);
console.log(`Building "${whichBuild}". Script contains ${builds[whichBuild].length} step(s).`);
execAll(builds[whichBuild]);
