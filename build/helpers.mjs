"use strict";
import {existsSync, rmSync} from "node:fs";
import {execSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import path from "node:path";

const PATH_TO_ROOT = "..";

const _dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const _home = path.join(path.dirname(fileURLToPath(import.meta.url)), PATH_TO_ROOT);
if (!_home) throw new Error("I don't know where home is. It is unsafe to continue.");

export function home(...dirs) {
	return path.normalize(path.join(_home, ...dirs))
};

export function rm(dir) {
	if (!dir || !dir.startsWith(home()) || dir === home()) throw new Error(`rm: "${dir}" is not a fully-qualified directory or it does not exist under "${_home}". It is unsafe to continue.`);
	if (!existsSync(dir)) {
		console.log(`Skipping removing ${dir} because it does not exist.`);
		return;
	}
	console.log(`rm (recursive): ${dir}`);
	rmSync(dir, {recursive: true});
};
