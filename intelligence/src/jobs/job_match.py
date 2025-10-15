import json
from ..core_client import CoreAPIClient
from ..ai.src.api import create_potential_match as evaluate_match


def create_potential_match(candidate_id: str, job_post_id: str):
    with CoreAPIClient() as client:
        job_post = client.get_job_post_context(job_post_id)
        candidate = client.get_candidate_profile(candidate_id)

    # The job functions must match
    if job_post.get('job_function') != candidate.get('job_function'):
        print('Job function mismatch')
        return

    match_result = evaluate_match(
        candidate,
        job_post
    )

    print(match_result)

    match_result = json.loads(match_result)

    with CoreAPIClient() as client:
        client.create_candidate_job_match({
            "candidate_profile_id": candidate_id,
            "job_post_id": job_post_id,
            "match_score": match_result['rating'],
            "match_details": match_result['explanation']
        })

    print("Match record created")

    return match_result
