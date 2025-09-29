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

2. Install the package in editable mode:
```bash
uv pip install -e .
```

3. If you plan to use JavaScript rendering (for dynamic websites), install Playwright browsers:
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
uv run python -m src.main crawl-jobs https://example.com/

# Multiple URLs
uv run python -m src.main crawl-jobs https://company1.com https://company2.com

# With JavaScript rendering for dynamic sites
uv run python -m src.main crawl-jobs https://example.com --js
```

### Crawl Company Information (Coming Soon)

```bash
uv run python -m src.main crawl-companies https://example.com
```
