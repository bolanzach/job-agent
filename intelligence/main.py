#!/usr/bin/env python3
import asyncio
import sys
import argparse
import logging
from src.scrapers.job_crawler import crawl_company_jobs
from src.scrapers.companies_crawler import discover_companies
from src.jobs.enhance_company import enhance_company
from src.jobs.enhance_job_post import enhance_job_posting
from src.jobs.job_match import create_potential_match

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def crawl_companies(urls):
    print(f"Crawling companies: {urls} - Not implemented yet")


def main():
    parser = argparse.ArgumentParser(
        description='Crawler module for web crawling tasks'
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    ### Crawlers:

    # Job postings crawler command
    job_parser = subparsers.add_parser('crawl-jobs', help='Crawl job postings from company IDs')
    job_parser.add_argument('company_ids', nargs='+', help='Company IDs to crawl for job postings')
    job_parser.add_argument('--js', '--javascript', action='store_true',
                            help='Use JavaScript rendering (requires playwright)')

    # Company crawler / discovery command
    discover_parser = subparsers.add_parser('discover-companies', help='Discover similar companies from seed companies')
    discover_parser.add_argument('seed_companies', nargs='+',
                                 help='Seed company names to start discovery (e.g., Google, Microsoft)')
    discover_parser.add_argument('--max-depth', type=int, default=3, help='Maximum recursion depth (default: 3)')
    discover_parser.add_argument('--max-per-level', type=int, default=10,
                                 help='Maximum companies to discover per level (default: 10)')

    ### Jobs:

    # Job posting enhancement command
    job_parser = subparsers.add_parser('enhance-job', help='Enhance a job posting')
    job_parser.add_argument('job_id', help='Job posting ID to enhance')

    # Company enhancement command
    company_parser = subparsers.add_parser('enhance-company', help='Enhance a company profile')
    company_parser.add_argument('company_id', help='Company ID to enhance')

    # Job matching command
    match_parser = subparsers.add_parser('match', help='Create a potential job match for a candidate')
    match_parser.add_argument('candidate_id', help='Candidate ID for job matching')
    match_parser.add_argument('job_id', help='Job posting ID to match')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        if args.command == 'crawl-jobs':
            asyncio.run(crawl_company_jobs(args.company_ids, use_javascript=args.js))
        elif args.command == 'discover-companies':
            asyncio.run(discover_companies(
                args.seed_companies,
                max_depth=args.max_depth,
                max_companies_per_level=args.max_per_level
            ))
        elif args.command == 'enhance-job':
            enhance_job_posting(args.job_id)
        elif args.command == 'enhance-company':
            enhance_company(args.company_id)
        elif args.command == 'match':
            create_potential_match(args.candidate_id, args.job_id)
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
