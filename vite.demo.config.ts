import {mergeConfig} from "vite";
import viteCommonConfig from "./vite.common.config";

export default mergeConfig(viteCommonConfig, {
	build: {
		outDir: "./dist-demo/",
		rollupOptions: { input: "./index.html" }
	},
});
