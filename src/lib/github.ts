const OWNER = "yogiputrap";
const REPO = "blog";
const BRANCH = "main";
const CONTENT_DIR = "blog";

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
  sha: string;
}

export interface MarkdownFile {
  name: string;
  path: string;
  download_url: string;
}

// Retry fetch with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delayMs = 500
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) throw err;
      // Wait before retrying (exponential backoff)
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
    }
  }
  // Should never reach here
  throw new Error("fetchWithRetry: exhausted retries");
}

async function fetchDirectoryContents(dirPath: string): Promise<GitHubFile[]> {
  const url = `${API_BASE}/${dirPath}?ref=${BRANCH}`;
  let res: Response;
  try {
    res = await fetchWithRetry(
      url,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
      },
      3,
      600
    );
  } catch (err) {
    throw new Error(
      `Network error fetching GitHub directory "${dirPath}": ${err instanceof Error ? err.message : String(err)
      }. Check your internet connection.`
    );
  }

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Please set GITHUB_TOKEN environment variable."
      );
    }
    if (res.status === 404) {
      throw new Error(
        `GitHub path not found: "${dirPath}". Check OWNER/REPO/BRANCH config.`
      );
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getAllMarkdownFiles(): Promise<MarkdownFile[]> {
  const files: MarkdownFile[] = [];

  async function crawl(dirPath: string) {
    const items = await fetchDirectoryContents(dirPath);

    for (const item of items) {
      if (item.type === "dir") {
        await crawl(item.path);
      } else if (
        item.type === "file" &&
        (item.name.endsWith(".md") || item.name.endsWith(".mdx"))
      ) {
        files.push({
          name: item.name,
          path: item.path,
          download_url: item.download_url || `${RAW_BASE}/${item.path}`,
        });
      }
    }
  }

  await crawl(CONTENT_DIR);
  return files;
}

export async function getFileContent(filePath: string): Promise<string> {
  const rawUrl = `${RAW_BASE}/${filePath}`;
  let res: Response;
  try {
    res = await fetchWithRetry(
      rawUrl,
      {
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {},
        next: { revalidate: 600 },
      },
      3,
      600
    );
  } catch (err) {
    throw new Error(
      `Network error fetching file "${filePath}": ${err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

export function getAvatarUrl(): string {
  return `https://github.com/${OWNER}.png`;
}

export { OWNER, REPO, BRANCH, CONTENT_DIR };
