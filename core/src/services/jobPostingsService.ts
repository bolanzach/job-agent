import {
  getJobPostById,
  getJobPostContextByJobId,
  insertJobPost,
  updateJobPostContext,
  CreateJobPostParams,
  UpdateJobPostContextParams
} from "../repositories/jobPostRepository.ts";

export class JobPostingsService {
  async createJobPosting(job: Omit<CreateJobPostParams, "id">) {
    return await insertJobPost({
      ...job,
      id: crypto.randomUUID()
    });
  }

  async getJobPostingById(id: string) {
    return await getJobPostById(id);
  }

  async updateJobPostContext(params: UpdateJobPostContextParams) {
    return await updateJobPostContext(params);
  }

  async getJobPostContextByJobId(id: string) {
    return await getJobPostContextByJobId(id);
  }


}

export const jobPostingsService = new JobPostingsService();
