import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
	type AssemblyBuilder,
	type DeployResult,
	type DestroyResult,
	type IIoHost,
	type IoMessage,
	type IoRequest,
	MemoryContext,
	Toolkit,
} from "@aws-cdk/toolkit-lib";
import { default as select } from "@inquirer/select";
import * as paint from "ansi-colors";
import { default as featureFlags } from "aws-cdk-lib/recommended-feature-flags.json";
import { default as loadingSpinner } from "yocto-spinner";
import { exitCli, renderDeploymentOutputs } from "./helpers";

export function updown(builder: AssemblyBuilder): UpDown {
	return new UpDownCli(builder);
}

export type UpDown = InstanceType<typeof UpDownCli>;

class UpDownCli {
	private readonly cdk: Toolkit;
	private readonly builder: AssemblyBuilder;

	public constructor(builder: AssemblyBuilder) {
		this.builder = builder;
		this.cdk = new Toolkit({
			ioHost: new NothingIoHost(),
		});
	}

	/**
	 * A mini cli for your app.
	 *
	 * Supported cli commands are: `up` & `down`.
	 */
	public async run(): Promise<void> {
		// Run action
		try {
			const command = await this.command();
			switch (command) {
				case "up": {
					await this.up();
					break;
				}
				case "down": {
					await this.down();
					break;
				}
			}
		} catch {
			exitCli();
		}
	}

	/**
	 * Up (deploy) your app.
	 * @returns The deployment result from the CDK toolkit
	 */
	public async up(): Promise<DeployResult> {
		const spinner = loadingSpinner({ text: "Deploying..." }).start();
		try {
			await using cx = await this.cdk.synth(await this.app());
			const deployment = await this.cdk.deploy(cx);
			spinner.success("Success!");
			renderDeploymentOutputs(deployment);
			return deployment;
		} catch (error: unknown) {
			spinner.error(String(error));
			throw error;
		}
	}

	/**
	 * Down (destroy) your app.
	 */
	public async down(): Promise<DestroyResult> {
		const spinner = loadingSpinner({ text: "Destroying..." }).start();
		try {
			await using cx = await this.cdk.synth(await this.app());
			const deployment = await this.cdk.destroy(cx);
			spinner.info(paint.cyan("Destroyed!"));
			return deployment;
		} catch (error: unknown) {
			spinner.error(String(error));
			throw error;
		}
	}

	private async app() {
		return this.cdk.fromAssemblyBuilder(this.builder, {
			disposeOutdir: true,
			contextStore: new MemoryContext(featureFlags),
			outdir: mkdtempSync(join(tmpdir(), "cdk-updown-")),
		});
	}

	private async command(args?: string[]): Promise<"up" | "down"> {
		const { positionals } = parseArgs({
			args,
			options: {}, // No options, only positional arguments
			strict: true,
			allowPositionals: true,
		});

		let command = positionals[0] as "up" | "down";

		if (!command || !["up", "down"].includes(command)) {
			try {
				command = await select<"up" | "down">(
					{
						message: "What would you like to do?",
						choices: [
							{ name: "⬆️  Deploy app", value: "up" },
							{ name: "⬇️  Destroy app", value: "down" },
						],
					},
					{
						clearPromptOnDone: true,
					},
				);
			} catch {
				exitCli(paint.yellow("Nothing to do."));
			}
		}

		return command;
	}
}

class NothingIoHost implements IIoHost {
	public async notify(_msg: IoMessage<unknown>): Promise<void> {
		// does nothing on purpose
	}
	public async requestResponse<T>(msg: IoRequest<unknown, T>): Promise<T> {
		return msg.defaultResponse;
	}
}
