#!/usr/bin/env python3
"""
Crawler module CLI - Main entry point for web crawling tasks
"""
import asyncio
import sys
import argparse
import logging
from job_crawler.main import crawl_company_jobs

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# async def crawl_job_posts(urls, use_javascript=False):
#     """Crawl job postings from company URLs and submit to Core API"""
#     logger.info(f"Crawling job postings from {len(urls)} companies")
#     logger.info(f"Using JavaScript rendering: {use_javascript}")
#
#     results = await crawl_company_jobs(urls, use_javascript=use_javascript)
#
#     total_jobs = sum(len(jobs) for jobs in results.values())
#     logger.info(f"Found {total_jobs} total job postings")
#
#     # Format and submit results to Core API
#     for company_url, job_postings in results.items():
#         formatted_jobs = [
#             {
#                 'url': job['url'],
#                 'title': job['title'],
#                 'text': job['text']
#             }
#             for job in job_postings
#         ]
#
#         if formatted_jobs:
#             try:
#                 response = core_client.submit_crawl_results({
#                     'company_url': company_url,
#                     'job_postings': formatted_jobs
#                 })
#                 logger.info(f"Submitted {len(formatted_jobs)} jobs for {company_url} to Core API")
#             except Exception as e:
#                 logger.error(f"Failed to submit results for {company_url}: {e}")


def crawl_companies(urls):
    """Crawl company information (not implemented yet)"""
    print(f"Crawling companies: {urls} - Not implemented yet")
    # TODO: Implement company information crawling


def main():
    parser = argparse.ArgumentParser(
        description='Crawler module for web crawling tasks'
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Job posts crawling command
    job_parser = subparsers.add_parser('crawl-jobs', help='Crawl job postings from company IDs')
    job_parser.add_argument('company_ids', nargs='+', help='Company IDs to crawl for job postings')
    job_parser.add_argument('--js', '--javascript', action='store_true',
                           help='Use JavaScript rendering (requires playwright)')

    # Company crawling command
    company_parser = subparsers.add_parser('crawl-companies', help='Crawl company information')
    company_parser.add_argument('urls', nargs='+', help='Company URLs to crawl')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Route to appropriate function
    try:
        if args.command == 'crawl-jobs':
            asyncio.run(crawl_company_jobs(args.company_ids, use_javascript=args.js))
        elif args.command == 'crawl-companies':
            crawl_companies(args.urls)
        else:
            parser.print_help()
            sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Crawl interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Crawl failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
