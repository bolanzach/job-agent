/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { CrawlRequest, CrawlResponse, JobPosting } from "./index.ts";

export type CrawlRequestMessage = {
  companyWebsites: string[];
  useJavaScript: boolean;
}

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<CrawlRequestMessage>) => {
  const { companyWebsites, useJavaScript } = e.data;

  console.log(`[Worker] Starting crawl for ${companyWebsites.length} companies`);

  try {
    // Create a temporary output file
    const tempOutputFile = await Deno.makeTempFile({ suffix: ".json" });

    const args = [
      "main.py",  // Changed from ../crawler/main.py
      ...companyWebsites,
      "-o", tempOutputFile,
      "--format", "json"
    ];

    if (useJavaScript) {
      args.push("--js");
    }

    // Run the Python crawler from the crawler directory using uv
    const crawlerDir = new URL("../../../../crawler", import.meta.url).pathname;
    console.log(`[Worker] Running: uv run python ${args[0]} [${companyWebsites.length} URLs] ...`);

    const command = new Deno.Command("uv", {
      args: ["run", "python", ...args],
      stdout: "piped",
      stderr: "piped",
      cwd: crawlerDir
    });

    const process = command.spawn();
    const { code, stdout, stderr } = await process.output();

    // Check if the process succeeded
    if (code !== 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(`Crawler failed with exit code ${code}: ${errorMessage}`);
    }

    // Log any stdout from the crawler (should be minimal since we're using -o)
    const stdoutText = new TextDecoder().decode(stdout);
    if (stdoutText.trim()) {
      console.log(`[Worker] Crawler output: ${stdoutText}`);
    }

    // Read the results from the output file
    const resultsJson = await Deno.readTextFile(tempOutputFile);
    const results = JSON.parse(resultsJson) as Record<string, JobPosting[]>;

    // Clean up temp file
    await Deno.remove(tempOutputFile);

    console.log(`[Worker] Crawl complete. Found results for ${Object.keys(results).length} companies`);

    // Send success response back to main thread
    const response: CrawlResponse = {
      success: true,
      data: results
    };

    self.postMessage(response);

  } catch (error) {
    console.error(`[Worker] Error during crawl:`, error);

    // Send error response back to main thread
    const response: CrawlResponse = {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };

    self.postMessage(response);
  }

  // Close the worker
  self.close();
};
