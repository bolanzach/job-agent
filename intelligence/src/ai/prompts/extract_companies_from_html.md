Extract a list of company names from the following HTML web page content.

**Content:**
{{HTML_CONTENT}}

Return a JSON array of companies with this exact format:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      }
    },
    "required": [
      "name"
    ],
    "additionalProperties": false
  }
}
```

## Rules:

- Only include actual companies (not products, services, or general terms).
- Only include a company if the full name is present in the HTML content (no ellipses or partial names).
- Do NOT include investment firms, venture capital firms, or private equity firms.

**IMPORTANT: Return ONLY the JSON array, no other text.**
