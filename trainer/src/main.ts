import Anthropic from "@anthropic-ai/sdk";

interface TrainingDataSet<Input extends object | null> {
  train: {
    input: Input;
    output: string;
  };
}

async function main() {
  console.log("Trainer initialized");

  const promptPaths = ["./userspace/prompt.txt", "./userspace/prompt.md"];
  let promptContent: string | undefined;

  for (const path of promptPaths) {
    try {
      const fileInfo = await Deno.stat(path);
      if (fileInfo.isFile) {
        promptContent = await Deno.readTextFile(path);
        break;
      }
    } catch {
      // File doesn't exist, try next
    }
  }

  if (!promptContent) {
    throw new Error("No prompt file found in ./userspace/");
  }

  console.log("Content:", promptContent);

  const runId = crypto.randomUUID();
  const outputDir = `./userspace/output/${runId}`;
}

if (import.meta.main) {
  main().catch((error) => {
    console.error("Error:", error);
    Deno.exit(1);
  });
}
