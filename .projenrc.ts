import { logo, TypeScriptProject } from "mrpj";
import { javascript } from "projen";
import { BiomeVscode } from "./projenrc/biome";

const project = new TypeScriptProject({
	repo: "mrgrain/cdk-updown",
	name: "@mrgrain/cdk-updown",
	description: "Self-executable CDK apps",
	authorName: "Momo Kornher",
	authorUrl: "https://moritzkornher.de",

	// Release & Automation
	// release: true,
	automationAppName: "projen-builder",
	workflowNodeVersion: "lts/-1",

	// Marketing
	logo: logo.Logo.fromFile("./images/logo.svg", {
		height: 100,
		width: 70,
	}),
	wordmarkOptions: {
		text: "CDK up / down",
		font: {
			family: "Palatino",
		},
		textPosition: {
			dx: -15,
			dy: 10,
		},
		size: {
			width: 810,
		},
	},

	// Developer Experience
	packageManager: javascript.NodePackageManager.NPM,
	biome: true,
	vscode: true,

	// TypeScript
	entrypoint: "./lib/main.js",
	entrypointTypes: "./lib/main.d.ts",
	tsconfig: {
		compilerOptions: {
			isolatedModules: true,
			isolatedDeclarations: true,
		} as javascript.TypeScriptCompilerOptions,
	},

	// Functionality
	deps: [
		"@aws-cdk/toolkit-lib",
		"@inquirer/select",
		"ansi-colors",
		"cli-table3",
		"yocto-spinner",
	],
	peerDeps: ["aws-cdk-lib@^2.174.0"],
});

// Exports
project.package.addField("exports", {
	".": {
		types: "./lib/main.d.ts",
		default: "./lib/main.js",
	},
});

// VSCode
new BiomeVscode(project);
project.vscode?.settings.addSetting("jest.useJest30", true);

project.synth();
