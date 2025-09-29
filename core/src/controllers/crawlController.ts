import { Controller, Post, Route, Body, Tags, Response } from "tsoa";
import type {CrawlRequest, CrawlResponse} from "../services/crawlService/index.ts";
import {crawlService} from "../services/crawlService/index.ts";

@Route("crawl")
@Tags("Crawl")
export class CrawlController extends Controller {

  /**
   * Crawl job postings from company websites
   */
  @Post("jobs")
  @Response<CrawlResponse>(200, "Success")
  @Response(500, "Internal Server Error")
  public async crawlJobPostsForCompanies(
    @Body() request: CrawlRequest
  ): Promise<CrawlResponse> {
    const result = await crawlService.crawlJobPostsForCompanies({
      ...request,
      useJavaScript: request.useJavaScript ?? false
    });

    if (!result.success) {
      this.setStatus(500);
    }

    return result;
  }
}
