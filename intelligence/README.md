# Crawler Module

A web crawler for extracting job postings and company information from websites.

## Setup

### Prerequisites
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager

### Installation

1. Install dependencies using uv:
```bash
cd crawler
uv sync
```

2. If you plan to use JavaScript rendering (for dynamic websites), install Playwright browsers:
```bash
uv run playwright install chromium
```

## Configuration

Set the Core API URL (optional, defaults to http://localhost:8000):
```bash
export CORE_API_URL=http://localhost:8000
```

## Usage

The crawler module provides commands for different crawling tasks:

### Crawl Job Postings

Crawl job postings from company websites and submit to Core API:

```bash
# Basic usage
uv run python main.py crawl-jobs <job_id>

# Multiple company IDs
uv run python main.py crawl-jobs <job_id> <job_id2> <job_id3>
```

### Crawl Company Information (Coming Soon)

```bash
python main.py crawl-companies https://example.com
```
