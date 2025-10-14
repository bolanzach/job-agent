# Intelligence Module

AI/LLM intelligence module for job posting enhancement and matching.

## Setup

```bash
# Install dependencies
uv sync
```

## Usage

```bash
# Enhance a job posting
uv run python main.py enhance-job <job_id>

# Enhance a company profile
uv run python main.py enhance-company <company_id>

# Create a *potential* match between a candidate and job post
uv run python main.py match <candidate_id> <job_id>
```

## Configuration

Set environment variables in `.env`:
- `CORE_API_URL` - Core API endpoint (default: http://localhost:8000)
- `ANTHROPIC_API_KEY` - Required for LLM functionality
