import os
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()


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

    def get_job_post(self, job_post_id: str) -> Dict[str, Any]:
        response = self.client.get(f"/api/job-posts/{job_post_id}")
        response.raise_for_status()
        return response.json()

    def get_job_post_context(self, job_post_id: str) -> Dict[str, Any]:
        response = self.client.get(f"/api/job-posts/{job_post_id}/context")
        response.raise_for_status()
        return response.json()

    def update_job_post_context(
        self,
        job_post_id: str,
        context: str,
        job_function: str
    ) -> Dict[str, Any]:
        payload = {
            "context": context,
            "jobFunction": job_function
        }
        response = self.client.put(
            f"/api/job-posts/{job_post_id}/context",
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def get_candidate_profile(self, candidate_profile_id: str) -> Dict[str, Any]:
        response = self.client.get(f"/api/candidates/{candidate_profile_id}")
        response.raise_for_status()
        return response.json()

    def create_candidate_job_match(self, match: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.post(
            "/api/candidate-job-matches",
            json=match
        )
        response.raise_for_status()
        return response.json()

    def close(self):
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


core_client = CoreAPIClient()