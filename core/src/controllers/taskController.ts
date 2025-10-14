import { Body, Controller, Post, Response, Route, Tags } from "tsoa";
import type {
  CrawlRequest,
  CrawlResponse,
  CreatePotentialMatchRequest,
  EnhanceCompanyRequest,
  EnhanceJobPostRequest,
} from "../services/crawlService/index.ts";
import { crawlService } from "../services/crawlService/index.ts";

@Route("tasks")
@Tags("Task Management")
export class TaskController extends Controller {
  @Post("crawl/jobs")
  @Response<CrawlResponse>(201, "Success")
  @Response(500, "Internal Server Error")
  public async crawlJobPostsForCompanies(
    @Body() request: CrawlRequest,
  ) {
    return await crawlService.crawlJobPostsForCompanies({
      ...request,
      useJavaScript: request.useJavaScript ?? false,
    });
  }

  @Post("enhance/job-posts")
  public async enhanceJobPostings(@Body() req: EnhanceJobPostRequest) {
    return await crawlService.enhanceJobPostings(req);
  }

  @Post("enhance/companies")
  public async enhanceCompanies(@Body() req: EnhanceCompanyRequest) {
    return await crawlService.enhanceJobPostings(req);
  }

  @Post("matches")
  public async match(@Body() req: CreatePotentialMatchRequest) {
    return await crawlService.createPotentialMatch(req);
  }
}
