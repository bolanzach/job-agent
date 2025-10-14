import sys
import httpx
from urllib.parse import quote
from bs4 import BeautifulSoup

from intelligence.src.ai.src.api import enhance_company_context
from intelligence.src.core_client import CoreAPIClient


def search_company_website(company_name: str) -> str | None:
    """Search for a company website using DuckDuckGo."""
    search_query = f"{company_name} official website"
    search_url = f"https://duckduckgo.com/html/?q={quote(search_query)}"

    client = httpx.Client(
        timeout=30.0,
        follow_redirects=True,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    )

    try:
        response = client.get(search_url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        for result in soup.find_all('a', class_='result__url'):
            url = result.get('href', '')
            if url and url.startswith('http'):
                return url

        # for result in soup.find_all('a', class_='result__a'):
        #     url = result.get('href', '')
        #     if url and url.startswith('http'):
        #         return url

    except Exception as e:
        print(f"Error searching for company website: {e}")
    finally:
        client.close()

    return None


def enhance_company(company_id: str):
    """
    Enhance a company with additional context.
    """
    try:
        with CoreAPIClient() as client:
            company = client.get_company(company_id)

        if not company.get('website'):
            website = search_company_website(company['name'])
            if website:
                print(f"Found website for {company['name']}: {website}")
                with CoreAPIClient() as client:
                    response = client.client.put(
                        f"/api/companies/{company_id}",
                        json={"website": website}
                    )
                    response.raise_for_status()
                company['website'] = website

        # enhanced_context = enhance_company_context(company)
        #
        # print(f"Enhanced Company Context: {enhanced_context}")
        # with CoreAPIClient() as client:
        #     client.update_company_context(company_id, {
        #         "context": enhanced_context
        #     })
    except Exception as e:
        print(f"Error enhancing Company: {e}")
