import { Body, Controller, Post, Route, Tags } from "tsoa";
import type {
  CrawlJobsRequest,
  CreatePotentialMatchRequest,
  DiscoverCompaniesRequest,
  EnhanceCompanyRequest,
  EnhanceJobPostRequest,
  SeedTaskRequest,
} from "../services/./tasksService/index.ts";
import { tasksService } from "../services/./tasksService/index.ts";

@Route("tasks")
@Tags("Task Management")
export class TaskController extends Controller {
  @Post("/seed")
  public async seed(
    @Body() request: SeedTaskRequest,
  ) {
    return await tasksService.seed(request);
  }

  @Post("/crawl/companies")
  public async crawlCompanies(
    @Body() request: DiscoverCompaniesRequest,
  ) {
    return await tasksService.discoverCompanies(request);
  }

  @Post("crawl/jobs")
  public async crawlJobPostsForCompanies(
    @Body() request: CrawlJobsRequest,
  ) {
    return await tasksService.crawlJobPostsForCompanies({
      ...request,

      // Crawling jobs usually requires JavaScript rendering
      useJavaScript: request.useJavaScript ?? true,
    });
  }

  @Post("enhance/job-posts")
  public async enhanceJobPostings(@Body() req: EnhanceJobPostRequest) {
    return await tasksService.enhanceJobPostings(req);
  }

  @Post("enhance/companies")
  public async enhanceCompanies(@Body() req: EnhanceCompanyRequest) {
    return await tasksService.enhanceCompanies(req);
  }

  @Post("matches")
  public async match(@Body() req: CreatePotentialMatchRequest) {
    return await tasksService.createPotentialMatch(req);
  }
}
