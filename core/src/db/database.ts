import { Database as SqliteDB } from "sqlite";

export class Database {
  private db: SqliteDB;

  constructor(path: string = "job-agent-core.db") {
    this.db = new SqliteDB(path);
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params);
    stmt.finalize();
    return rows as T[];
  }

  close() {
    this.db.close();
  }
}

// Singleton instance
export const db = new Database();
