import { ThreadedWorkQueueService, WorkQueue } from "../workQueueService.ts";
import { EventsService, eventsService } from "../eventsService.ts";

export interface CrawlRequest {
  companyIds: string[];
  useJavaScript?: boolean;
}

export interface CrawlResponse {
  success: boolean;
  data?: Record<string, JobPosting[]>;
  error?: string;
}

export interface JobPosting {
  url: string;
  title: string;
  text: string;
  raw_text: string;
}

export interface EnhanceJobPostRequest {
  ids: string[];
}

export interface EnhanceCompanyRequest {
  ids: string[];
}

export interface CreatePotentialMatchRequest {
  candidateId: string;
  jobPostId: string;
}

export class CrawlService {
  constructor(private eventsService: EventsService) {}

  async crawlJobPostsForCompanies(request: CrawlRequest) {
    // this.workQueue.add({
    //   workerUrl: new URL("./crawlJobPostsForCompanies.ts", import.meta.url),
    //   data: {
    //     companyIds: request.companyIds,
    //     useJavaScript: false,
    //   },
    // });

    this.eventsService.emit("CrawlJobPostsForCompanies", {
      companyIds: request.companyIds,
      useJavaScript: false,
    });
  }

  async enhanceJobPostings(params: EnhanceJobPostRequest) {
    for (const id of params.ids) {
      // this.workQueue.add({
      //   workerUrl: new URL("./enhanceJobPost.ts", import.meta.url),
      //   data: {
      //     id,
      //   },
      // });
      this.eventsService.emit("EnhanceJobPost", { id });
    }
  }

  async enhanceCompanies(params: EnhanceCompanyRequest) {
    for (const id of params.ids) {
      // this.workQueue.add({
      //   workerUrl: new URL("./enhanceCompany.ts", import.meta.url),
      //   data: {
      //     id,
      //   },
      // });
      this.eventsService.emit("EnhanceCompany", { id });
    }
  }

  async createPotentialMatch(req: CreatePotentialMatchRequest) {
    // this.workQueue.add({
    //   workerUrl: new URL("./createPotentialMatch.ts", import.meta.url),
    //   data: req,
    // });
    this.eventsService.emit("CreatePotentialMatch", req);
  }
}

export const crawlService = new CrawlService(eventsService);
