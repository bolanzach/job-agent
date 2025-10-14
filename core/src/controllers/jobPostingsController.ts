import { Body, Controller, Get, Post, Put, Response, Route, Tags } from "tsoa";
import { jobPostingsService } from "../services/jobPostingsService.ts";
import { Path } from "npm:@tsoa/runtime@6.6.0";
import type {
  CreateJobPostParams,
  UpdateJobPostContextParams,
} from "../repositories/jobPostRepository.ts";

type UpdateJobPostContextRequest = Pick<
  UpdateJobPostContextParams,
  "context" | "jobFunction"
>;

@Route("job-posts")
@Tags("Job Postings")
export class JobPostingsController extends Controller {
  @Get("/:id")
  @Response(500, "Internal Server Error")
  public async list(@Path() id: string) {
    return await jobPostingsService.getJobPostingById(id);
  }

  @Post("/")
  @Response(500, "Internal Server Error")
  public async create(@Body() params: Omit<CreateJobPostParams, "id">) {
    return await jobPostingsService.createJobPosting(params);
  }

  @Put("/:id/context")
  @Response(500, "Internal Server Error")
  public async updateContext(
    @Path() id: string,
    @Body() params: UpdateJobPostContextRequest,
  ) {
    return await jobPostingsService.updateJobPostContext({
      ...params,
      id,
    });
  }

  @Get("/:id/context")
  @Response(500, "Internal Server Error")
  public async getContext(@Path() id: string) {
    return await jobPostingsService.getJobPostContextByJobId(id);
  }
}
