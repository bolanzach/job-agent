import { db } from "../db/database.ts";
import type { JobPost } from "../db/models.ts";

export type CreateJobPostParams = Omit<JobPost, "created_at" | "deleted_at">;

export type UpdateJobPostContextParams = {
  id: string;
  context: string;
  jobFunction: string;
}

export function insertJobPost(params: CreateJobPostParams) {
  const query = `
    INSERT INTO job_posts (id, url, company_id, title, content)
    VALUES (?, ?, ?, ?, ?) RETURNING *;
  `;

  return db.query<JobPost>(query, [
    params.id,
    params.url,
    params.company_id,
    params.title,
    params.content
  ]);
}

export function getJobPostById(id: string): JobPost | undefined {
  const query = `
    SELECT id, url, company_id, title, content, created_at, deleted_at
    FROM job_posts
    WHERE id = ? AND deleted_at IS NULL
  `;

  const results = db.query<JobPost>(query, [id]);
  const [jobPost] = results;
  if (!jobPost) {
    throw new Error(`Job post with ID ${id} not found`);
  }
  return jobPost;
}

export function updateJobPostContext(params: UpdateJobPostContextParams) {
  const query = `
    INSERT INTO job_posting_contexts (job_post_id, context, job_function)
    VALUES (?, ?, ?)
    ON CONFLICT(job_post_id) DO UPDATE SET context = excluded.context, job_function = excluded.job_function
    RETURNING *;
  `;

  return db.query<JobPost>(query, [
    params.id,
    params.context,
    params.jobFunction
  ]);
}

export function getJobPostContextByJobId(id: string): JobPost | undefined {
  const query = `
    SELECT job_posts.*, job_posting_contexts.context, job_posting_contexts.job_function
    FROM job_posts
    LEFT JOIN job_posting_contexts ON job_posts.id = job_posting_contexts.job_post_id
    WHERE job_posts.id = ? AND deleted_at IS NULL
  `;

  const results = db.query<JobPost>(query, [id]);
  return results[0];
}
