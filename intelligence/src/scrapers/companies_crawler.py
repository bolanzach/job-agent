import logging
import json
from typing import List, Dict, Set
from urllib.parse import urlparse, quote, urljoin
import httpx
from bs4 import BeautifulSoup
from intelligence.src.ai.src.api import extract_companies_with_llm
from intelligence.src.core_client import CoreAPIClient

logger = logging.getLogger(__name__)


class CompanyDiscoverer:
    def __init__(self):
        self.client = httpx.Client(
            timeout=30.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        )
        self.discovered_company_names: Set[str] = set()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close()

    def _clean_html(self, html: str) -> str:
        """Clean HTML to reduce token usage for LLM."""
        soup = BeautifulSoup(html, 'html.parser')

        for element in soup.find_all(['script', 'style', 'meta', 'link', 'noscript', 'iframe']):
            element.decompose()

        for element in soup.find_all(['nav', 'footer', 'header']):
            element.decompose()

        text = soup.get_text(separator='\n', strip=True)
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        cleaned_text = '\n'.join(lines[:500])

        return cleaned_text[:8000]

    def extract_companies_from_html(self, html_content: str) -> List[Dict[str, str]]:
        """Use LLM to extract company names from HTML content."""
        cleaned_html = self._clean_html(html_content)

        try:
            response = extract_companies_with_llm(cleaned_html)
            response = response.strip()

            companies = json.loads(response)

            valid_companies = []
            for company in companies:
                if isinstance(company, dict) and 'name' in company:
                    name = company['name'].lower()
                    if name not in self.discovered_company_names:
                        valid_companies.append(company)
                        self.discovered_company_names.add(name)

            return valid_companies

        except Exception as e:
            logger.error(f"Error extracting companies with LLM: {e}")
            return []

    def get_search_results_urls(self, query: str) -> List[str]:
        """Get URLs from search engine results using a more reliable approach."""
        search_url = f"https://duckduckgo.com/html/?q={quote(query)}"

        try:
            response = self.client.get(search_url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            urls = []
            for result in soup.find_all('a', class_='result__url'):
                url = result.get('href', '')
                if url and url.startswith('http'):
                    parsed = urlparse(url)
                    if parsed.netloc and not any(
                            skip in parsed.netloc for skip in ['duckduckgo.', 'youtube.', 'wikipedia.']):
                        urls.append(url)

            # Also check for result links
            for result in soup.find_all('a', class_='result__a'):
                url = result.get('href', '')
                if url and url.startswith('http'):
                    parsed = urlparse(url)
                    if parsed.netloc and not any(
                            skip in parsed.netloc for skip in ['duckduckgo.', 'youtube.', 'wikipedia.']):
                        if url not in urls:
                            urls.append(url)

            return urls[:20]

        except Exception as e:
            logger.error(f"Error getting search results: {e}")
            return []

    def crawl_page_for_companies(self, url: str, max_depth: int = 3, current_depth: int = 0) -> List[
        Dict[str, str]]:
        """Crawl a page and its links to find companies."""
        if current_depth >= max_depth:
            return []

        companies = []

        try:
            logger.info(f"Crawling {url} (depth {current_depth})")
            response = self.client.get(url)
            response.raise_for_status()
            html = response.text

            found_companies = self.extract_companies_from_html(html)
            companies.extend(found_companies)

            # if current_depth < max_depth - 1:
            #     soup = BeautifulSoup(html, 'html.parser')
            #     links = []
            #
            #     for link in soup.find_all('a', href=True):
            #         href = link['href']
            #         full_url = urljoin(url, href)
            #
            #         if full_url.startswith('http'):
            #             parsed = urlparse(full_url)
            #             if parsed.netloc == urlparse(url).netloc:
            #                 links.append(full_url)
            #
            #     links = list(set(links))[:5]
            #
            #     for link_url in links:
            #         link_companies = self.crawl_page_for_companies(
            #             link_url,
            #             max_depth=max_depth,
            #             current_depth=current_depth + 1
            #         )
            #         companies.extend(link_companies)

        except Exception as e:
            logger.error(f"Error crawling {url}: {e}")

        return companies

    def search_and_extract_companies(self, company_name: str) -> List[Dict[str, str]]:
        """Search for similar companies and extract them from results pages."""
        similar_companies = []

        search_queries = [
            f"companies similar to {company_name}",
            f"{company_name} competitors alternatives",
        ]

        for query in search_queries:
            logger.info(f"Searching: {query}")

            result_urls = self.get_search_results_urls(query)

            for url in result_urls:
                companies = self.crawl_page_for_companies(url, max_depth=2)
                similar_companies.extend(companies)

        return similar_companies

        # unique_companies = {}
        # for company in similar_companies:
        #     name = company.get('name', '').lower()
        #     if name and name not in unique_companies and name not in self.discovered_companies:
        #         unique_companies[name] = company
        #         self.discovered_companies.add(name)
        #
        # return list(unique_companies.values())

    def discover_companies_recursive(
            self,
            seed_company: str,
            max_depth: int = 3,
    ):
        """Recursively discover companies starting from a seed company."""
        self.discovered_company_names.add(seed_company.lower())
        queue = [(seed_company, 0)]
        visited = set()

        while queue:
            company_name, depth = queue.pop(0)

            if depth >= max_depth:
                continue

            if company_name in visited:
                continue

            visited.add(company_name)
            logger.info(f"Discovering companies similar to {company_name} (depth: {depth})")
            similar_companies = self.search_and_extract_companies(company_name)

            for company in similar_companies:
                similar_company_name = company.get('name', '')
                if similar_company_name.lower() not in visited:
                    with CoreAPIClient() as core_client:
                        core_client.create_company(similar_company_name)

                    if depth + 1 < max_depth:
                        queue.append((similar_company_name.lower(), depth + 1))

    def mock_save_company(self, company: str):
        """Mock API call to save company to database."""
        # logger.info(
        #     f"[MOCK] POST /api/companies - Data: {{name: '{company_data.get('name')}', website: '{company_data.get('website')}'}}")
        # return {'id': f"mock-id-{company_data.get('name', '').lower().replace(' ', '-')}", 'status': 'saved'}


def discover_companies(
        seed_companies: List[str],
        max_depth: int = 3,
        max_companies_per_level: int = 10
):
    """Main function to discover companies from seed companies."""
    with CompanyDiscoverer() as discoverer:
        for seed_company in seed_companies:
            logger.info(f"Starting discovery with seed company: {seed_company}")

            discoverer.discover_companies_recursive(
                seed_company,
                max_depth=max_depth,
            )
