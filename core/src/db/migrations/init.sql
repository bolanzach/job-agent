
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    website TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS company_contexts (
    company_id TEXT NOT NULL REFERENCES companies(id),
    context TEXT NOT NULL
);
CREATE INDEX idx_company_contexts_company_id ON company_contexts(company_id);


CREATE TABLE IF NOT EXISTS job_posts (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    company_id TEXT NOT NULL REFERENCES companies(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX idx_job_posts_company_id ON job_posts(company_id);


CREATE TABLE IF NOT EXISTS job_posting_contexts (
    job_post_id TEXT NOT NULL REFERENCES job_posts(id) UNIQUE,
    context TEXT NOT NULL,
    job_function TEXT NOT NULL
);
CREATE INDEX idx_job_posting_contexts_job_post_id ON job_posting_contexts(job_post_id);


CREATE TABLE IF NOT EXISTS candidate_profiles (
    id TEXT PRIMARY KEY,
    resume TEXT,
    job_function TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS candidate_job_matches (
    id TEXT PRIMARY KEY,
    candidate_profile_id TEXT NOT NULL REFERENCES candidate_profiles(id),
    job_post_id TEXT NOT NULL REFERENCES job_posts(id),

    match_score INTEGER NOT NULL,
    match_details TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    CONSTRAINT unique_candidate_job UNIQUE (candidate_profile_id, job_post_id)
);

-- CREATE TABLE IF NOT EXISTS candidates (
--     id TEXT PRIMARY KEY,
--     given_name TEXT NOT NULL,
--     surname TEXT NOT NULL,
--     email TEXT NOT NULL UNIQUE,
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ DEFAULT NULL
-- );

