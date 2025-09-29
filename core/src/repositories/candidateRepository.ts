import {db} from "../db/database.ts";
import {CandidateProfile} from "../db/models.ts";

export function getCandidateById(id: string): CandidateProfile | undefined {
  const query = `
    SELECT *
    FROM candidate_profiles
    WHERE id = ? AND deleted_at IS NULL
  `;

  const results = db.query<CandidateProfile>(query, [id]);
  const [candidate] = results;
  if (!candidate) {
    throw new Error(`CandidateProfile with ID ${id} not found`);
  }
  return candidate;
}
