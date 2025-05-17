// firecrawl-fetch.js
// Usage: node firecrawl-fetch.js

import fetch from 'node-fetch';

async function fetchFirecrawlMarkdown(url) {
  const apiUrl = 'http://10.32.147.79:3002/v1/scrape';
  const apiKey = 'LUwgYA9bwgDYYCdeC2K7wFU5yjRLqKqcKnVWW9eS_';
  const payload = {
    url,
    formats: ['markdown']
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (result.data.markdown) {
    return result.data.markdown;
  } else {
    throw new Error(result.error || 'No markdown returned');
  }
}

// Example usage:
(async () => {
  try {
    const url = 'https://svelte.dev/docs/svelte/$state'; // Change to your target URL
    const markdown = await fetchFirecrawlMarkdown(url);
    console.log('Firecrawl Markdown Content:\n', markdown);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
