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
	biome: true,
	vscode: true,

	// Functionality
	devDeps: ["mrpj@0.2.1"],
});

new BiomeVscode(project);

project.synth();
