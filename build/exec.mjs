import {execSync, spawn} from "node:child_process";

const tty = {
	tty: !process.env.NO_TTY && process.stdout.isTTY,
	width: Math.min(120, process.stdout.columns || 120),
	fill(before, filler, after) {
		const remain = Math.max(0, this.width - before.length - after.length);
		return before + filler.repeat(remain) + after;
	}
};

const sidebarWidth = 5;

function header(command, step, ofSteps) {
	const wholeCommand = [command.cmd, ...(command.args ?? [])].join(" ").split("\n")[0];
	let title = command.title ? command.title : command.cmd.toString().split("\n")[0];
	if (!tty.tty) {
		console.log(tty.fill("+", "=", "+"));
		console.log(tty.fill(`| ${title} ---> ${wholeCommand} `, " ", `[ ${step} / ${ofSteps} ] |`));
		if (!command.title) console.log(tty.fill(`| ${wholeCommand}`, " ", "|"));
		console.log(tty.fill(`|`, " ", "|"));
		return;
	}

	console.log(tty.fill(`╭${'─'.repeat(title.length + 3)}┬`, "─", "╮"));
	console.log(tty.fill(`│ ${title}  ┼─▷ ${wholeCommand}`, " ", `${step} / ${ofSteps} │`));

	if (!command.title) console.log(tty.fill(`│ ${wholeCommand}`, " ", "│"));

	const sepBar = tty.fill(`╞`, "═", `╡`).split('');
	sepBar[title.length + 4] = "╧";
	sepBar[sidebarWidth + 1] = (title.length === sidebarWidth - 3) ? "╪" : "╤";
	console.log(sepBar.join(""));
	output("");
}

function footer(command, step, ofSteps, code) {
	if (!tty.tty) {
		const commandTitle = command.title ?? [command.cmd, ...(command.args ?? [])].join(" ").split("\n")[0];
		console.log(tty.fill("|", " ", "|"));
		console.log(tty.fill(`| ${commandTitle}`, " ", "|"));
		console.log(tty.fill("| " + (code ? "[ FAILED ]" : "[   OK   ]") + ` Completed with code ${code} `, " ", "|"));
		console.log(tty.fill("+", "=", "+"));
		return;
	}

	const emoji = code ? "❌" : "✔️";
	console.log("\r" + tty.fill("├─────┴", "─", "┤"));
	console.log(tty.fill(`│ ${emoji}  Completed with code ${code} `, " ", "│"));
	console.log(tty.fill("╰", "─", "╯"));

}

let remnant = null;

function output(data, streamName = "stdout") {
	if (!tty.tty) {
		simpleOutput(data, streamName);
		return;
	}

	const str = data.toString();
	const bottomBar = tty.fill("└", "─", "┘").split('');
	bottomBar[sidebarWidth + 1] = "┴";

	const lines = ((remnant ?? "") + str).match(/(.*(?:\n|.+$))/g) ?? [];
	process.stdout.write("\r");
	const emoji = streamName === "stderr" ? "⚠️" : "🟢";

	lines.forEach((line) => {
		const lineEmoji = line ? emoji : "  ";
		process.stdout.write(tty.fill(`│ ${lineEmoji}  │ ${line.replace("\n", "")}`, " ", "│") + "\n");
	});
	process.stdout.write(bottomBar.join(""));
}

function simpleOutput(data, streamName) {
	process[streamName].write(data.toString());
}

export default async function exec(command, step, ofSteps) {
	header(command, step, ofSteps);

	output("");

	switch (typeof command.cmd) {
		case "string":
			await execShell(command, step, ofSteps);
			break;
		case "function":
			await execJs(command, step, ofSteps);
			break;
		default:
			throw new Error(`${command.cmd} is not a valid command.`);
	}
}

async function execShell(command, step, ofSteps) {
	const spawned = spawn(command.cmd, command.args ?? [], {
		shell: true,
		stdio: ["inherit", "pipe", "pipe"],
		env: {...process.env, ...command.env, NO_COLOR: "1"}
	});

	spawned.stdout.on("data", data => output(data, "stdout"));
	spawned.stderr.on("data", data => output(data, "stderr"));

	await new Promise(resolve => spawned.on("close", (code) => {
		footer(command, step, ofSteps, code);
		if (code !== 0) throw new Error(`Command did not complete successfully`);
		resolve();
	}));
	console.log("");
}

async function execJs(command, step, ofSteps) {
	if (tty.tty) {
		console.log("\r" + tty.fill("│ JavaScript function ", "┈", " │") + "\n");
	} else {
		console.log(tty.fill("| (JavaScript function) ", " ", "|") + "\n");
	}
	await Promise.resolve(command.cmd());

	footer(command, step, ofSteps, 0);
}
