import asyncio
import logging
from typing import List, Dict, Optional, TypedDict
from urllib.parse import urljoin, urlparse
import httpx
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright, Page

from ..core_client import CoreAPIClient

logger = logging.getLogger(__name__)


class PageContent(TypedDict):
    url: str
    title: str
    text: str
    raw_text: str


class JobCrawler:
    def __init__(self, use_javascript: bool = False):
        self.use_javascript = use_javascript
        self.client = httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            }
        )
        self.browser = None
        self.playwright = None

    async def __aenter__(self):
        if self.use_javascript:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def fetch_with_httpx(self, url: str) -> str:
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logger.error(f"Error fetching {url} with httpx: {e}")
            raise

    async def fetch_with_playwright(self, url: str) -> str:
        try:
            async with await self.browser.new_page() as page:
                await page.goto(url, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(2000)
                return await page.content()
        except Exception as e:
            logger.error(f"Error fetching {url} with playwright: {e}")
            raise

    async def fetch_page(self, url: str) -> str:
        if self.use_javascript:
            return await self.fetch_with_playwright(url)
        return await self.fetch_with_httpx(url)

    def extract_text_content(self, html: str, url: str) -> PageContent:
        soup = BeautifulSoup(html, 'lxml')

        # Remove nav and footer elements first
        for element in soup.find_all(['nav', 'footer', 'header']):
            element.decompose()

        for script in soup(["script", "style", "meta", "link", "noscript"]):
            script.decompose()

        text = soup.get_text(separator='\n', strip=True)

        text_lines = []
        for line in text.split('\n'):
            line = line.strip()
            if line:
                text_lines.append(line)

        return {
            'url': url,
            'title': soup.title.string if soup.title else '',
            'text': '\n'.join(text_lines),
            'raw_text': text
        }

    async def find_careers_page(self, company_url: str) -> Optional[str]:
        """
        Attempts to find the careers/jobs page for a given company URL.
        Returns the careers page URL if found, otherwise returns None.
        """
        try:
            logger.info(f"Looking for careers page on: {company_url}")
            html = await self.fetch_page(company_url)
            soup = BeautifulSoup(html, 'lxml')

            careers_patterns = [
                'careers', 'jobs', 'join-us', 'join-our-team', 'work-with-us',
                'opportunities', 'openings', 'hiring', 'employment', 'vacancies',
                'talent', 'recruitment', 'work-at', 'life-at'
            ]

            nav_elements = soup.find_all(['nav', 'header', 'footer'])
            for nav in nav_elements:
                links = nav.find_all('a', href=True)
                for link in links:
                    href = link['href']
                    text = (link.get_text() or '').lower().strip()
                    href_lower = href.lower()

                    if any(pattern in href_lower or pattern in text for pattern in careers_patterns):
                        careers_url = urljoin(company_url, href)
                        if urlparse(careers_url).netloc == urlparse(company_url).netloc:
                            logger.info(f"Found careers page: {careers_url}")
                            return careers_url

            all_links = soup.find_all('a', href=True)
            for link in all_links:
                href = link['href']
                text = (link.get_text() or '').lower().strip()
                href_lower = href.lower()

                score = 0
                for pattern in careers_patterns:
                    if pattern in href_lower:
                        score += 2
                    if pattern in text:
                        score += 1

                if score >= 2:
                    careers_url = urljoin(company_url, href)
                    if urlparse(careers_url).netloc == urlparse(company_url).netloc:
                        logger.info(f"Found careers page: {careers_url}")
                        return careers_url

            common_paths = [
                '/careers', '/jobs', '/career', '/job', '/opportunities',
                '/work-with-us', '/join-us', '/openings', '/employment'
            ]

            for path in common_paths:
                test_url = urljoin(company_url, path)
                try:
                    test_response = await self.client.head(test_url, follow_redirects=True)
                    if test_response.status_code == 200:
                        logger.info(f"Found careers page at common path: {test_url}")
                        return test_url
                except:
                    continue

            logger.warning(f"No careers page found for: {company_url}")
            return None

        except Exception as e:
            logger.error(f"Error finding careers page for {company_url}: {e}")
            return None

    def find_job_links(self, html: str, base_url: str) -> List[str]:
        soup = BeautifulSoup(html, 'lxml')
        job_links = []

        job_keywords = [
            'career', 'job', 'position', 'opening', 'vacancy',
            'opportunity', 'role', 'hiring', 'recruit', 'join',
            'apply', 'application', 'employment'
        ]

        for link in soup.find_all('a', href=True):
            href = link['href']
            text = (link.get_text() or '').lower()
            href_lower = href.lower()

            if any(keyword in href_lower or keyword in text for keyword in job_keywords):
                full_url = urljoin(base_url, href)
                if urlparse(full_url).netloc == urlparse(base_url).netloc:
                    job_links.append(full_url)

        return list(set(job_links))

    async def scrape_job_postings(self, jobs_page_url: str, max_depth: int) -> List[PageContent]:
        job_postings: List[PageContent] = []
        visited = set()
        to_visit = [(jobs_page_url, 0)]

        while to_visit:
            url, depth = to_visit.pop(0)

            if url in visited or depth > max_depth:
                continue

            visited.add(url)

            try:
                logger.info(f"Scraping: {url} (depth: {depth})")
                html = await self.fetch_page(url)

                page_content = self.extract_text_content(html, url)

                is_likely_job_page = any(keyword in page_content['text'].lower() for keyword in [
                    'job description', 'responsibilities', 'qualifications',
                    'requirements', 'apply now', 'submit application',
                    'experience required', 'skills required', 'about the role',
                    'the role', 'apply here'
                ])

                if is_likely_job_page and len(page_content['text']) > 400:
                    job_postings.append(page_content)
                    logger.info(f"Found job posting: {url}")

                # The literal "careers page" will often catch on is_likely_job_page so we always go one level deeper
                if depth < max_depth:
                    job_links = self.find_job_links(html, url)
                    for link in job_links:
                        if link not in visited:
                            to_visit.append((link, depth + 1))

            except Exception as e:
                logger.error(f"Error processing {url}: {e}")
                continue

        return job_postings


async def crawl_company_jobs(company_ids: List[str], use_javascript: bool = False, max_depth=10):
    job_pages: Dict[str, List[PageContent]] = {}
    companies: Dict[str, Dict] = {}

    with CoreAPIClient() as client:
        for id in company_ids:
            company = client.get_company(id)
            companies[company.get('website')] = company

    logger.info(companies)

    async with JobCrawler(use_javascript=use_javascript) as crawler:
        for item in companies.items():
            company_url, company = item
            try:
                logger.info(f"Starting crawl for: {company_url}")

                careers_page = await crawler.find_careers_page(company_url)

                if careers_page:
                    logger.info(f"Using careers page: {careers_page}")
                    job_postings = await crawler.scrape_job_postings(careers_page, max_depth)
                else:
                    logger.info(f"No careers page found, crawling main site: {company_url}")
                    job_postings = await crawler.scrape_job_postings(company_url, max_depth)

                job_pages[company_url] = job_postings
                logger.info(f"Found {len(job_postings)} job postings for {company_url}")
            except Exception as e:
                logger.error(f"Failed to crawl {company_url}: {e}")
                job_pages[company_url] = []

    with CoreAPIClient() as client:
        for job_postings in job_pages.items():
            company_url, postings = job_postings
            company = companies.get(company_url)
            if not company:
                logger.error(f"No company record found for {company_url}, skipping job postings")
                continue

            for posting in postings:
                try:
                    job_data = {
                        'url': posting.get('url'),
                        'title': posting.get('title'),
                        'content': posting.get('text'),
                        'company_id': company.get('id')
                    }
                    client.create_job_posting(job_data)
                except Exception as e:
                    # We expect some failures here due to duplicate job posts, so just log and continue
                    logger.warning(f"Failed to create job post for {posting['url']}: {e}")
