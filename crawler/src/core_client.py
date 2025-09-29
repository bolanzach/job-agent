import os
import httpx
from typing import Dict, Any, Optional

class CoreAPIClient:
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or os.getenv("CORE_API_URL", "http://localhost:8000")
        self.client = httpx.Client(
            base_url=self.base_url,
            timeout=30.0,
            headers={
                "Content-Type": "application/json"
            }
        )

    def get_company(self, company_id: str) -> Dict[str, Any]:
        response = self.client.get(f"/api/companies/{company_id}")
        response.raise_for_status()
        return response.json()

    def create_job_posting(self, job_posting: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.post("/api/job-posts", json=job_posting)
        response.raise_for_status()
        return response.json()

    def close(self):
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


core_client = CoreAPIClient()