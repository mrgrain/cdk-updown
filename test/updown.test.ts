import {
	type AssemblyBuilder,
	type DeployResult,
	type DestroyResult,
	Toolkit,
} from "@aws-cdk/toolkit-lib";
import { type UpDown, updown } from "../src/main";

// Mock the toolkit-lib
jest.mock("@aws-cdk/toolkit-lib", () => ({
	Toolkit: jest.fn(),
	MemoryContext: jest.fn(),
}));

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

describe("UpDown", () => {
	let upDown: UpDown;
	let mockBuilder: jest.Mocked<AssemblyBuilder>;
	let mockToolkit: jest.Mocked<Toolkit>;

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Create mock builder
		mockBuilder = {
			// Add minimal required mock implementation
		} as unknown as jest.Mocked<AssemblyBuilder>;

		// Create mock toolkit
		mockToolkit = {
			synth: jest.fn().mockResolvedValue({
				[Symbol.asyncDispose]: jest.fn(),
			}),
			deploy: jest.fn().mockResolvedValue({
				stacks: [],
			} as DeployResult),
			destroy: jest.fn().mockResolvedValue(undefined),
			fromAssemblyBuilder: jest.fn().mockResolvedValue({}),
		} as unknown as jest.Mocked<Toolkit>;

		// Mock Toolkit constructor
		(Toolkit as jest.Mock).mockImplementation(() => mockToolkit);

		// Create instance
		upDown = updown(mockBuilder);
	});

	describe("up", () => {
		it("should deploy successfully and return DeployResult", async () => {
			// Arrange
			const mockDeployResult: DeployResult = {
				stacks: [],
			};
			mockToolkit.deploy.mockResolvedValue(mockDeployResult);

			// Act
			const result = await upDown.up();

			// Assert
			expect(mockToolkit.synth).toHaveBeenCalled();
			expect(mockToolkit.deploy).toHaveBeenCalled();
			expect(result).toBe(mockDeployResult);
		});

		it("should handle deployment errors", async () => {
			// Arrange
			const error = new Error("Deployment failed");
			mockToolkit.deploy.mockRejectedValue(error);

			// Act & Assert
			await expect(() => upDown.up()).rejects.toThrow("Deployment failed");
		});
	});

	describe("down", () => {
		it("should destroy successfully and return DestroyResult", async () => {
			// Arrange
			const mockDestroyResult: DestroyResult = {
				stacks: [],
			};
			mockToolkit.destroy.mockResolvedValue(mockDestroyResult);

			// Act
			const result = await upDown.down();

			// Assert
			expect(mockToolkit.synth).toHaveBeenCalled();
			expect(mockToolkit.destroy).toHaveBeenCalled();
			expect(result).toBe(mockDestroyResult);
		});

		it("should handle destroy errors", async () => {
			// Arrange
			const error = new Error("Destroy failed");
			mockToolkit.destroy.mockRejectedValue(error);

			// Act & Assert
			await expect(() => upDown.down()).rejects.toThrow("Destroy failed");
		});
	});

	describe("run", () => {
		it("should handle up command from arguments", async () => {
			// Arrange
			const spy = jest.spyOn(upDown, "up");

			// Mock command to return "down"
			jest.spyOn(upDown as any, "command").mockResolvedValue("up");

			// Act
			await upDown.run();

			// Assert
			expect(spy).toHaveBeenCalled();
		});

		it("should handle down command from arguments", async () => {
			// Arrange
			const spy = jest.spyOn(upDown, "down");

			// Mock command to return "down"
			jest.spyOn(upDown as any, "command").mockResolvedValue("down");

			// Act
			await upDown.run();

			// Assert
			expect(spy).toHaveBeenCalled();
		});

		it("should handle errors", async () => {
			// Arrange
			const error = new Error("Deployment failed");
			mockToolkit.deploy.mockRejectedValue(error);

			// Mock command to return "down"
			jest.spyOn(upDown as any, "command").mockResolvedValue("up");

			// Mock process.exit to prevent test from actually exiting
			const mockExit = jest.spyOn(process, "exit").mockImplementation();

			// Act
			await upDown.run();

			// Assert
			expect(mockExit).toHaveBeenCalledWith();
			expect(process.exitCode).toBe(1);

			// Cleanup
			mockExit.mockRestore();
		});
	});
});
