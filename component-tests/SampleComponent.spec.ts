import {test, expect} from "@playwright/experimental-ct-vue";
import Component from "../src/SampleComponent.vue";

test("It Works", async ({mount}) => {
	const component = await mount(Component, {props: { message: "Hello" }});
	await expect(component.locator(".message")).toContainText("Hello");
	expect(await component.locator(".time").textContent()).toMatch(/^\d+$/);
});

