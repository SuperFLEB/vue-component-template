<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import time from "@/util/time.js";
import versionInfo from "@superfleb/vite-plugin-version";
import type {Timestamp} from "@t/Timestamp.ts";

type Props = { message?: string };
const props = withDefaults(defineProps<Props>(), { message: "No message." });

const then = new Date();
const now = ref<Timestamp>(time());

let interval: number | undefined = undefined;
onMounted(() => {
	if (interval !== undefined) clearInterval(interval);
	setInterval(() => now.value = time(), 1000);
});
onUnmounted(() => {
	if (interval !== undefined) clearInterval(interval);
	interval = undefined;
});

const version = versionInfo();
</script>

<template>
	<div class="component">
		<em>This is the sample Vue component.</em>

		<table>
			<thead>
				<tr><th colspan="3">Build Information (provided by @superfleb/vite-plugin-version)</th></tr>
			</thead>
			<tbody>
				<tr><th>Package</th><td>{{version.name}}</td></tr>
				<tr><th>Description</th><td>{{version.description ?? "(not available)"}}</td></tr>
				<tr><th>Version</th><td>{{version.version}}</td></tr>
				<tr><th>Build Time</th><td>{{new Date(version.buildTime).toUTCString()}}</td></tr>
			</tbody>
			<thead>
				<tr><th colspan="3">Instance Information</th></tr>
			</thead>
			<tbody>
				<tr><th>Current Time</th><td>{{new Date(now).toString()}} (<span class="time">{{now}}</span>)</td></tr>
				<tr><th>Last re-render time</th><td>{{ then.toString() }} ({{ then.getTime() }})</td></tr>
				<tr><th>Message</th><td class="message">{{ props.message }}</td></tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped lang="scss">
.component {
	display: inline-block;
	border: 4px dashed #888;
	padding: 20px;
	border-radius: 10px;

	td, th {
		border: 1px solid #000;
		border-collapse: collapse;
		padding: 0.25em;
	}
	th {
		text-align: right;
	}
}
</style>