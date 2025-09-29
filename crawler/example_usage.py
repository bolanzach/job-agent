#!/usr/bin/env python3
"""
Example usage of the job crawler
"""
import asyncio
import json
import logging
from src.crawler import crawl_companies

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def example_crawl():
    company_urls = [
        "https://watershed.com",
    ]

    print("Starting job crawler...")
    print(f"Crawling: {company_urls}")

    # Run the crawler
    results = await crawl_companies(company_urls, use_javascript=False)

    # Process results
    for company_url, job_postings in results.items():
        print(f"\n{'='*60}")
        print(f"Company: {company_url}")
        print(f"Found {len(job_postings)} job postings")

    # Save to JSON file
    with open('job_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to job_results.json")

    return results

if __name__ == "__main__":
    # Run the example
    asyncio.run(example_crawl())
