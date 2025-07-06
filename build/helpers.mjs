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

export function execAll(execSpecArray) {
	execSpecArray.forEach((execSpec, idx) => exec(execSpec, idx+1, execSpecArray.length));
}

export function exec(fnOrCmdAndName, step, ofSteps) {
	const explicitName = Array.isArray(fnOrCmdAndName) && fnOrCmdAndName[1];
	let name = explicitName ?? ((Array.isArray(fnOrCmdAndName)) ? fnOrCmdAndName[0] : fnOrCmdAndName.toString().split("\n")[0]);

	const command = (Array.isArray(fnOrCmdAndName)) ? fnOrCmdAndName[0] : fnOrCmdAndName;

	const width = Math.min(120, process.stdout.columns || 120);
	const fill = (str, filler, cap) => str + filler.repeat(Math.max(1, width - str.length - cap.length)) + cap;

	console.log(fill(" ┌", "─", "┐ "));
	console.log(fill(`╒╡ ${name} ╞`, "═", `═╡ ⏳  ${step} / ${ofSteps}  ╞╕`));
	console.log(fill(`╯│ ${command.toString().split("\n")[0]}`, " ", "│╰") + "\n");
	switch (typeof command) {
		case "string":
			execSync(command, { stdio: "inherit" });
			break;
		case "function":
			command();
			break;
		default:
			throw new Error(`${command} is not a valid command.`);
	}
	console.log(fill("╮"," ","╭ "));
	console.log(fill(`╘╡ ✔️ ${name} ╞`, "═", `═╡  ✔️ ${step} / ${ofSteps}  ╞╛`));
	console.log(fill(" └", "─", "┘ ") + "\n");
}
