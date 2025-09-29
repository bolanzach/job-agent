// Database models with TypeScript interfaces

export interface Company {
  id: string;
  name: string;
  website: string;
  created_at: string;
  deleted_at: string | null;
}

export interface JobPost {
  id: string;
  url: string;
  company_id: string;
  title: string;
  content: string;
  created_at: string;
  deleted_at: string | null;
}

// export interface Candidate {
//   id: string;
//   given_name: string;
//   surname: string;
//   email: string;
//   created_at: string;
//   deleted_at: string | null;
// }

export interface CandidateProfile {
  id: string;
  resume?: string;
  job_function: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CandidateJobMatch {
  id: string;
  candidate_profile_id: string;
  job_post_id: string;
  match_score: number;
  match_details: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
