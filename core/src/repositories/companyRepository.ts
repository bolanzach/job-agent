import { db } from "../db/database.ts";
import type { Company } from "../db/models.ts";

export interface CreateCompanyParams {
  name: string;
}

export type UpdateCompanyParams = {
  companyId: string;
  website: string;
};

export type UpdateCompanyContextParams = {
  companyId: string;
  context: string;
};

export function listCompanies() {
  const query = `
    SELECT id, name, website, created_at, deleted_at
    FROM companies
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  return db.query<Company>(query);
}

export function createCompany(params: CreateCompanyParams) {
  const query = `
    INSERT INTO companies (id, name, created_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    RETURNING id, name, website, created_at
  `;
  return db.query<Company>(query, [
    crypto.randomUUID(),
    params.name,
  ]);
}

export function getCompanyById(id: string): Company | undefined {
  const query = `
    SELECT id, name, website, created_at, deleted_at
    FROM companies
    WHERE id = ? AND deleted_at IS NULL
  `;

  const results = db.query<Company>(query, [id]);
  return results[0];
}

export function updateCompany(params: UpdateCompanyParams) {
  const query = `
    UPDATE companies
    SET website = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND deleted_at IS NULL
    RETURNING *
  `;
  return db.query<Company>(query, [
    params.website,
    params.companyId,
  ]);
}

export function updateCompanyContext(params: UpdateCompanyContextParams) {
  const query = `
    INSERT INTO company_contexts (company_id, context, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(company_id) DO UPDATE SET context = excluded.context
    RETURNING *;
  `;

  return db.query(query, [
    params.companyId,
    params.context,
  ]);
}

export function getCompanyContext(companyId: string) {
  const query = `
    SELECT context
    FROM company_contexts
    WHERE company_id = ?
  `;

  const results = db.query<{ context: string }>(query, [companyId]);
  return results[0];
}
