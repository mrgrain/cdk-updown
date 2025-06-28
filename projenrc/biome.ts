import type { IConstruct } from "constructs";
import { Component, type typescript } from "projen";

export class BiomeVscode extends Component {
	public constructor(scope: IConstruct) {
		super(scope);

		const tsProject = this.project as typescript.TypeScriptProject;
		tsProject.vscode?.settings.addSettings({
			"editor.defaultFormatter": "biomejs.biome",
			"editor.formatOnSave": true,
			"biome.lsp.bin": "node_modules/.bin/biome",
			"editor.codeActionsOnSave": {
				"source.fixAll.biome": "explicit",
				"source.organizeImports.biome": "explicit",
			},
		});

		[
			"javascript",
			"typescript",
			"json",
			"jsonc",
			"html",
			"yaml",
			"css",
			"markdown",
		].forEach((lang) =>
			tsProject.vscode?.settings.addSetting(
				"editor.defaultFormatter",
				"biomejs.biome",
				lang,
			),
		);
	}
}
