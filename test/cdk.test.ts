import { type DeployResult, Toolkit } from "@aws-cdk/toolkit-lib";
import { Topic } from "aws-cdk-lib/aws-sns";
import { App, Stack } from "aws-cdk-lib/core";
import { updown } from "../src/main";

// Mock the spinner
jest.mock("yocto-spinner", () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		start: jest.fn().mockReturnThis(),
		success: jest.fn(),
		error: jest.fn(),
		info: jest.fn(),
	}),
}));

describe("CDK integration", () => {
	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Create mock toolkit
		Toolkit.prototype.deploy = jest.fn().mockResolvedValue({
			stacks: [],
		} as DeployResult);

		Toolkit.prototype.destroy = jest.fn().mockResolvedValue(undefined);
	});

	describe("context", () => {
		it("should receive feature flags", async () => {
			// arrange
			const upDown = updown(async ({ context }) => {
				expect(context).toMatchSnapshot();

				const app = new App();
				const stack = new Stack(app);
				new Topic(stack, "Topic");

				return app.synth();
			});

			// Act
			await upDown.up();

			// Assert
			expect.assertions(1);
		});
	});
});
