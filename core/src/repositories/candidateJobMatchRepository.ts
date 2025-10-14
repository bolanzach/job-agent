import { db } from "../db/database.ts";
import { CandidateJobMatch } from "../db/models.ts";

export type CreateMatchParams = Omit<
  CandidateJobMatch,
  "id" | "created_at" | "deleted_at" | "updated_at"
>;

export function createMatch(params: CreateMatchParams): CandidateJobMatch {
  const query = `
    INSERT INTO candidate_job_matches (id, candidate_profile_id, job_post_id, match_score, match_details)
    VALUES (?, ?, ?, ?, ?) RETURNING *;
  `;

  const results = db.query<CandidateJobMatch>(query, [
    `${params.candidate_profile_id}_${params.job_post_id}`,
    params.candidate_profile_id,
    params.job_post_id,
    params.match_score,
    params.match_details,
  ]);
  return results[0];
}
