import type { DeployResult } from "@aws-cdk/toolkit-lib";
import * as paint from "ansi-colors";
import { default as Table } from "cli-table3";

export function exitCli(msg?: string): void {
	if (msg) {
		console.error(msg);
	}
	process.exitCode = 1;
	process.exit();
}

export function renderDeploymentOutputs(deployment: DeployResult): void {
	for (const stack of deployment.stacks) {
		const outputs = stack.outputs;
		if (Object.keys(outputs).length > 0) {
			const table = new Table();

			table.push([
				{
					colSpan: 2,
					content: `${paint.bold.yellow(stack.stackName)} \n${paint.yellow(stack.stackArn)}`,
					hAlign: "center",
				},
			]);

			for (const [key, output] of Object.entries(outputs)) {
				table.push([paint.bold.cyan(key), output]);
			}

			console.log(table.toString());
		}
	}
}
