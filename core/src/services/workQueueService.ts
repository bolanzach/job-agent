export class WorkQueueService<T> {
  private queue: T[] = [];

  constructor(
    private runWork: (item: T) => Promise<void>,
    private delay: number = 1000,
  ) {}

  add(item: T) {
    this.queue.push(item);
    if (this.queue.length === 1) {
      this.processQueue();
    }
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      try {
        await this.runWork(item);
      } catch (error) {
        console.error("Error processing work item:", error);
      }
      this.queue.shift();
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.delay));
      }
    }
  }
}

export type ThreadedWorkQueueItem = {
  workerUrl: URL;
  data: unknown;
};

const runThreadedWork = async (item: ThreadedWorkQueueItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      item.workerUrl,
      { type: "module" },
    );

    worker.onmessage = (_e: MessageEvent) => {
      resolve();
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(new Error(`Worker error: ${error.message}`));
      worker.terminate();
    };

    worker.onmessageerror = (error) => {
      reject(new Error(`Worker message error: ${error}`));
      worker.terminate();
    };

    worker.postMessage(item.data);
  });
};

export class ThreadedWorkQueueService
  extends WorkQueueService<ThreadedWorkQueueItem> {
  constructor(delay?: number) {
    super(runThreadedWork, delay);
  }
}

export const WorkQueue = new ThreadedWorkQueueService();
