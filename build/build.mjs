"use strict";
import {copyFileSync, mkdirSync, existsSync, rmSync} from "node:fs";
import {execSync} from "child_process";
import {rm, home, execAll} from "./helpers.mjs";

const DEFAULT_BUILD = "app";
const builds = {
	"app": [
		["yarn vue-tsc --b --noEmit", "Check TypeScript"],
		["yarn vite build", "Vite build"],
		["yarn vue-tsc --b", "Generate .d.ts files"],
		["resolve-tspaths -p tsconfig.lib.json", "Resolve TypeScript aliases in .d.ts files"],
		["api-extractor run --local --verbose -c api-extractor.jsonc", "Create .d.ts rollup file"],
		[() => rm(home("dist/dts")), "Clean up unnecessary .d.ts files"]
	],
	"demo": [
		["vite build -c vite.build-demo.config.ts"],
	]
};

builds.release = [
	["yarn run test-ct", "Playwright Component Test"],
	...builds.app,
]

// --- 8< --------------------------------------------------------------------------------------------------------------
// No need to edit below this line.

process.chdir(home());
const whichBuild = process.argv[2] ?? DEFAULT_BUILD;
if (!builds[whichBuild]) throw new Error(`Build name ${whichBuild} is not valid.`);
console.log(`Building "${whichBuild}". Script contains ${builds[whichBuild].length} step(s).`);
execAll(builds[whichBuild]);
