import sys

from ..ai.src.api import extract_job_function
from ..core_client import CoreAPIClient


def enhance_job_posting(job_post_id: str):
    """
    Enhance job posting with additional context.
    """
    try:
        with CoreAPIClient() as client:
            job_post = client.get_job_post(job_post_id)

        job_description = job_post.get('content', '')
        extracted_job_function = extract_job_function(job_description)

        with CoreAPIClient() as client:
            client.update_job_post_context(
                job_post_id,
                context="UPDATED WITH AI CONTEXT",
                job_function=extracted_job_function
            )

    except Exception as e:
        print(f"Error enhancing JobPosting: {e}")
