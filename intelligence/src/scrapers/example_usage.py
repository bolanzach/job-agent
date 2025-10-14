#!/usr/bin/env python3
"""
Example usage of the job crawler
"""
import asyncio
import logging
from companies_crawler import discover_companies

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def example_crawl_companies():
    companies = [
        "replenysh",
    ]

    print("Starting companies crawler...")
    print(f"Crawling: {companies}")

    results = await discover_companies(companies)

    return results


if __name__ == "__main__":
    asyncio.run(example_crawl_companies())
