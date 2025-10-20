import { ThreadedWorkQueueService, WorkQueue } from "./workQueueService.ts";

const MAP_EVENT_TO_WORKER = {
  "DiscoverCompanies": new URL(
    "./tasksService/worker.discoverCompanies.ts",
    import.meta.url,
  ),
  "CrawlJobPostsForCompanies": new URL(
    "./tasksService/worker.crawlJobPostsForCompanies.ts",
    import.meta.url,
  ),
  "CreatePotentialMatch": new URL(
    "./tasksService/worker.createPotentialMatch.ts",
    import.meta.url,
  ),
  "EnhanceCompany": new URL(
    "./tasksService/worker.enhanceCompany.ts",
    import.meta.url,
  ),
  "EnhanceJobPost": new URL(
    "./tasksService/worker.enhanceJobPost.ts",
    import.meta.url,
  ),
} satisfies Record<string, URL>;

export type JobAgentEvent = keyof typeof MAP_EVENT_TO_WORKER;

export class EventsService {
  constructor(private localWorkQueue: ThreadedWorkQueueService) {}

  emit(event: JobAgentEvent, data: unknown) {
    const workerUrl = MAP_EVENT_TO_WORKER[event];
    this.localWorkQueue.add({
      workerUrl,
      data,
    });
  }
}

export const eventsService = new EventsService(WorkQueue);
