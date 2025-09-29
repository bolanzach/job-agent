# Intelligence Module

AI/LLM intelligence module for job posting enhancement and matching.

## Setup

```bash
# Install dependencies
uv sync

# Install the package in editable mode
uv pip install -e .
```

## Usage

```bash
# Enhance a job posting
uv run python -m src.main enhance-job <job_id>

# Enhance a company profile (not yet implemented)
uv run python -m src.main enhance-company <company_id>

# Create a *potential* match between a candidate an job post
uv run python -m src.main match <candidate_id> <job_id>
```

## Configuration

Set environment variables in `.env`:
- `CORE_API_URL` - Core API endpoint (default: http://localhost:8000)
- `ANTHROPIC_API_KEY` - Required for LLM functionality
