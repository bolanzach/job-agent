/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<{ id: string }>) => {
  const { id } = e.data;

  console.log(`[EnhanceJobPost] Starting for: ${id}`);

  try {
    const args = [
      "main.py",
      "enhance-job",
      id,
    ];

    const intelligenceDir =
      new URL("../../../../intelligence", import.meta.url).pathname;
    console.log(`[EnhanceJobPost] Running: uv run python ${args.join(" ")}`);

    const command = new Deno.Command("uv", {
      args: ["run", "python", ...args],
      stdout: "piped",
      stderr: "piped",
      cwd: intelligenceDir,
    });

    const process = command.spawn();
    const { code, stderr } = await process.output();

    // Check if the process succeeded
    if (code !== 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(
        `EnhanceJobPost failed with exit code ${code}: ${errorMessage}`,
      );
    }

    console.log(`[EnhanceJobPost] completed successfully`);

    self.postMessage({
      success: true,
    });
  } catch (error) {
    console.error(`[EnhanceJobPost] Error:`, error);

    // Send error response back to main thread
    const response = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };

    self.postMessage(response);
  }

  self.close();
};
