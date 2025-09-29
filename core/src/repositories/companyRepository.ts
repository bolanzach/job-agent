import { db } from "../db/database.ts";
import type { Company } from "../db/models.ts";

export function listCompanies() {
  const query = `
    SELECT id, name, website, created_at, deleted_at
    FROM companies
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  return db.query<Company>(query);
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
