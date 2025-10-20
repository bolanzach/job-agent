/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { CrawlResponse } from "./index.ts";

// Handle messages from the main thread
self.onmessage = async (e: any) => {
  console.log(`[DiscoverCompaniesJob] Starting crawl`);

  try {
    const args = [
      "main.py",
      "discover-companies",
      e.data.companyName,
    ];

    const intelDir =
      new URL("../../../../intelligence", import.meta.url).pathname;
    console.log(
      `[DiscoverCompaniesJob] Running: uv run python ${args.join(" ")}`,
    );

    const command = new Deno.Command("uv", {
      args: ["run", "python", ...args],
      stdout: "piped",
      stderr: "piped",
      cwd: intelDir,
    });

    const process = command.spawn();
    const { code, stderr } = await process.output();

    // Check if the process succeeded
    if (code !== 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(
        `DiscoverCompaniesJob failed with exit code ${code}: ${errorMessage}`,
      );
    }

    console.log(`[DiscoverCompaniesJob] completed successfully`);

    self.postMessage({
      success: true,
    });
  } catch (error) {
    console.error(`[DiscoverCompaniesJob] Error during crawl:`, error);
    const response: CrawlResponse = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };

    self.postMessage(response);
  }

  self.close();
};
