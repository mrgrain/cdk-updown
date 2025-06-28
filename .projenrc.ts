import { logo, TypeScriptProject } from "mrpj";
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

	// Marketing
	logo: logo.Logo.placeholder(),
	wordmarkOptions: {
		text: "CDK up ⬆️ / down ⬇️",
		font: {
			family: "Palatino",
		},
		textPosition: {
			dy: 10,
		},
		size: {
			width: 1100,
		},
	},

	// Developer Experience
	biome: true,
	vscode: true,

	// Functionality
	devDeps: ["mrpj@0.2.1"],
});

new BiomeVscode(project);

project.synth();
