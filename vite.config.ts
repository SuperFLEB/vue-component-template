import libBuildConfig from "./vite.lib.config.ts";
import demoBuildConfig from "./vite.demo.config.ts";
export default () => {
	switch (process.env.BUILD_TYPE) {
		case "demo":
			return demoBuildConfig;
		case "lib":
		default:
			return libBuildConfig;
	}
};
