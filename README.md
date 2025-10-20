# Job Agent

Agentic program designed to assist with candidate job searching.

## Requirements

- Python 3.8+
- Deno 2.3.3+
- Claude API key

## Usage

- Install Python dependencies: `cd intelligence && uv sync`
- Add your CLAUDE API key to a `.env` file (see `.env.example` for format)
- Start the REST API: `cd core && deno task start`

Now you should be able to "seed" the agent with companies to kick off the job search process.

```shell
curl --location 'localhost:8000/api/tasks/seed' \
--header 'Content-Type: application/json' \
--data '{
    "companyNames": [
        "Microsoft",
        "Google",
    ]
}'
```
