import { EventsService, eventsService } from "../eventsService.ts";
import { CompanyService, companyService } from "../companyService.ts";

export interface SeedTaskRequest {
  companyNames: string[];
}

export interface DiscoverCompaniesRequest {
  companyId: string;
}

export interface CrawlJobsRequest {
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

export class TasksService {
  constructor(
    private eventsService: EventsService,
    private companyService: CompanyService,
  ) {}

  async seed(request: SeedTaskRequest) {
    for (const companyName of request.companyNames) {
      const company = await this.companyService.createCompany({
        name: companyName,
      });
      if (company) {
        await this.enhanceCompanies({ ids: [company.id] });
        await this.discoverCompanies({ companyId: company.id });
      }
    }
  }

  async discoverCompanies(request: DiscoverCompaniesRequest) {
    const company = await this.companyService.getCompanyById(request.companyId);
    if (!company) {
      throw new Error(`Company not found for ID: ${request.companyId}`);
    }

    this.eventsService.emit("DiscoverCompanies", {
      companyName: company.name,
    });
  }

  async crawlJobPostsForCompanies(request: CrawlJobsRequest) {
    this.eventsService.emit("CrawlJobPostsForCompanies", {
      companyIds: request.companyIds,
      useJavaScript: false,
    });
  }

  async enhanceJobPostings(params: EnhanceJobPostRequest) {
    for (const id of params.ids) {
      this.eventsService.emit("EnhanceJobPost", { id });
    }
  }

  async enhanceCompanies(params: EnhanceCompanyRequest) {
    for (const id of params.ids) {
      this.eventsService.emit("EnhanceCompany", { id });
    }
  }

  async createPotentialMatch(req: CreatePotentialMatchRequest) {
    this.eventsService.emit("CreatePotentialMatch", req);
  }
}

export const tasksService = new TasksService(eventsService, companyService);
