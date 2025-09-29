import {jobPostingsService} from "./jobPostingsService.ts";

export interface PredictionRequest {
  candidateId: string;
  jobPostId: string;
}

export class PredictionService {
  async getPredictions(req: PredictionRequest) {
    const jobPost = await jobPostingsService.getJobPostingById(req.jobPostId);
    if (!jobPost) {
      throw new Error("Job post not found");
    }
  }
}
