<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import time from "@/util/time.js";
import type {Timestamp} from "@t/Timestamp.ts";

type Props = { message?: string };
const props = withDefaults(defineProps<Props>(), { message: "No message." });

const now = ref<Timestamp>(new Date().getTime());
let interval: number | undefined = undefined;
onMounted(() => {
	if (interval !== undefined) clearInterval(interval);
	setInterval(() => now.value = time(), 1000);
});
onUnmounted(() => {
	if (interval !== undefined) clearInterval(interval);
	interval = undefined;
});
</script>

<template>
	<div class="component">This is the sample Vue component. <span class="message">{{ props.message }}</span> <span class="time">{{ now }}</span></div>
</template>

<style scoped lang="scss">
.component {
	font-size: 3em;
	.time {
		color: red;
	}
}
</style>