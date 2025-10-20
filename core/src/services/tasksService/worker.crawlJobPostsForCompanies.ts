/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { CrawlResponse } from "./index.ts";

export type CrawlRequestMessage = {
  companyIds: string[];
  useJavaScript: boolean;
};

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<CrawlRequestMessage>) => {
  const { companyIds, useJavaScript } = e.data;

  console.log(`[CrawlJobPostsForCompanies] Starting crawl`);

  try {
    const args = [
      "main.py",
      "crawl-jobs",
      ...companyIds,
    ];

    if (useJavaScript) {
      args.push("--js");
    }

    // Run the Python crawler from the crawler directory using uv
    const crawlerDir =
      new URL("../../../../intelligence", import.meta.url).pathname;
    console.log(
      `[CrawlJobPostsForCompanies] Running: uv run python ${args.join(" ")}`,
    );

    const command = new Deno.Command("uv", {
      args: ["run", "python", ...args],
      stdout: "piped",
      stderr: "piped",
      cwd: crawlerDir,
    });

    const process = command.spawn();
    const { code, stderr } = await process.output();

    // Check if the process succeeded
    if (code !== 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(
        `CrawlJobPostsForCompanies failed with exit code ${code}: ${errorMessage}`,
      );
    }

    console.log(`[CrawlJobPostsForCompanies] completed successfully`);

    self.postMessage({
      success: true,
    });
  } catch (error) {
    console.error(`[CrawlJobPostsForCompanies] Error during crawl:`, error);
    const response: CrawlResponse = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };

    self.postMessage(response);
  }

  self.close();
};
