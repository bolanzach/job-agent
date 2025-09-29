import {companyService} from "../companyService.ts";
import {jobPostingsService} from "../jobPostingsService.ts";

export interface CrawlRequest {
  companyIds: string[];
  useJavaScript?: boolean;
}

export interface CrawlResponse {
  success: boolean;
  data?: Record<string, JobPosting[]>;
  error?: string;
}

export interface JobPosting {
  url: string;
  title: string;
  text: string;
  raw_text: string;
}

export class CrawlService {
  async crawlJobPostsForCompanies(request: CrawlRequest): Promise<CrawlResponse> {
    const worker = new Worker(
      new URL("./worker.ts", import.meta.url).href,
      { type: "module" }
    );

    const companies = await Promise.all(request.companyIds.map(id => companyService.getCompanyById(id)));

    try {
      const result = new Promise<CrawlResponse>((resolve, reject) => {
        if (!worker) {
          reject(new Error("Worker not initialized"));
          return;
        }

        // Listen for messages from worker
        worker.onmessage = (e: MessageEvent) => {
          const response = e.data as CrawlResponse;
          resolve(response);
          worker.terminate();
        };

        // Handle worker errors
        worker.onerror = (error) => {
          reject(new Error(`Worker error: ${error}`));
          worker.terminate();
        };

        // Handle worker termination
        worker.onmessageerror = (error) => {
          reject(new Error(`Worker message error: ${error}`));
          worker.terminate();
        };
      });

      worker.postMessage({
        companyWebsites: companies.filter(c => c).map(c => c!.website),
        useJavaScript: request.useJavaScript ?? false
      });

      console.log('[CrawlService] Crawl request sent to worker');

      const jobPostingsPerCompany = await result;

      Object.entries(jobPostingsPerCompany.data || {}).forEach(([website, postings]) => {
        const company = companies.find(c => c && c.website === website)!;
        try {
          postings.forEach(posting => {
            jobPostingsService.createJobPosting({
              // id: crypto.randomUUID(),
              url: posting.url,
              company_id: company.id,
              title: posting.title,
              content: posting.text,
              // created_at: new Date().toISOString(),
              // deleted_at: null
            });
          });
        } catch (err) {
          //
        }
      });

      return jobPostingsPerCompany;
    } catch (error) {
      worker.terminate();
      console.error(`[CrawlService] Crawl failed: ${error}`);
      return {
        success: false,
        error: `Failed to crawl: ${error}`
      };
    }
  }
}

export const crawlService = new CrawlService();
