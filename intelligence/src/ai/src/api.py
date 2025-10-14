from pathlib import Path
from .llm_client import get_llm_client


def extract_job_function(job_description: str) -> str:
    """
    Extract the primary job function from a job description using LLM.

    Args:
        job_description: The job posting text to analyze

    Returns:
        A job function category like {software_development} or {project_management}
    """
    prompt_path = Path(__file__).parent.parent / "prompts" / "extract_job_function.md"
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()

    prompt = prompt_template.replace("{{JOB_DESCRIPTION}}", job_description)

    client = get_llm_client()
    response = client.generate_completion(
        prompt=prompt,
        max_tokens=50,  # Job function should be short
        temperature=0.3  # Lower temperature for more consistent categorization
    )

    job_function = response.strip()

    return job_function


def enhance_company_context(company):
    """
    Enhance a company with additional information.
    """
    prompt_path = Path(__file__).parent.parent / "prompts" / "enhance_company_context.md"
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()

    prompt = prompt_template.replace("{{COMPANY_NAME}}", company.get('name', ''))
    prompt = prompt.replace("{{COMPANY_WEBSITE}}", company.get('website', ''))

    client = get_llm_client()
    response = client.generate_completion(
        prompt=prompt,
        max_tokens=1000,
        temperature=0.4
    )
    return response.strip()


def create_potential_match(candidate_profile, job_posting):
    """
    Evaluate the match between a candidate and a job posting using LLM.
    """
    prompt_path = Path(__file__).parent.parent / "prompts" / "candiate_job_match.md"
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()

    # Replace template variables
    prompt = prompt_template.replace("{{CANDIDATE_PROFILE}}", candidate_profile.get('resume', ''))
    prompt = prompt.replace("{{JOB_TITLE}}", job_posting.get('title', ''))
    prompt = prompt.replace("{{JOB_DESCRIPTION}}", job_posting.get('content', ''))

    client = get_llm_client()
    response = client.generate_completion(
        prompt=prompt,
        max_tokens=500,
        temperature=0.4,
        advanced=True
    )
    return response.strip()


def extract_companies_with_llm(html_content: str):
    prompt_path = Path(__file__).parent.parent / "prompts" / "extract_companies_from_html.md"
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()

    # Replace template variables
    prompt = prompt_template.replace("{{HTML_CONTENT}}", html_content)

    client = get_llm_client()
    response = client.generate_completion(
        prompt=prompt,
        max_tokens=500,
        temperature=0.4
    )
    return response.strip()
