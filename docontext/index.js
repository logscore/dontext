#!/usr/bin/env node  

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

// Create an MCP server
const server = new McpServer({
  name: "docontext",
  version: "1.0.0"
});

// Define the scrape tool that will call the Firecrawl API
server.tool(
  "scrape",
  {
    url: z.string().url("Please provide a valid URL"),
  },
  async ({ url }) => {
    try {
      // Prepare the request payload
      const payload = {
        url,
        formats: ['markdown']
      };
      
      // Make the API request to the crawler
      const response = await fetch("http://10.32.147.79:3002/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer LUwgYA9bwgDYYCdeC2K7wFU5yjRLqKqcKnVWW9eS_`
        },
        body: JSON.stringify(payload)
      });

      // Parse the response
      const result = await response.json();

      // Check if the request was successful
      if (!response.ok || !result.success) {
        return {
          content: [{ 
            type: "text", 
            text: `Error: response was not okay'}` 
          }],
          isError: true
        };
      }

      // Add markdown content
      if (result?.data?.markdown) {
        // Sanitize the markdown before returning
        const sanitizeMarkdown = (await import('./sanitizeMarkdown.js')).default;
        const sanitized = sanitizeMarkdown(result.data.markdown);
        return {
          content: [{ 
            type: "text", 
            text: sanitized 
          }]
        };
      }

    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error: ${error.message || 'An unexpected error occurred'}` 
        }],
        isError: true
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Server started");
