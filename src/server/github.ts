import fs from 'fs';
import path from 'path';

export interface GitHubUserInfo {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

export interface GitHubRepoInfo {
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

export interface ValidateTokenResult {
  success: boolean;
  user?: GitHubUserInfo;
  repo?: GitHubRepoInfo;
  repoExists?: boolean;
  canCreateRepo?: boolean;
  error?: string;
}

export interface PushOptions {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  commitMessage?: string;
}

export interface PushResult {
  success: boolean;
  repoUrl?: string;
  commitUrl?: string;
  commitSha?: string;
  branch?: string;
  filesCount?: number;
  uploadedFiles?: string[];
  timestamp?: string;
  error?: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const USER_AGENT = 'OffGrid-OG-AIStudio-Deployer';

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
    'Content-Type': 'application/json',
  };
}

/**
 * Validates a GitHub Personal Access Token and checks repository access
 */
export async function validateGitHub(
  token: string,
  owner?: string,
  repoName?: string
): Promise<ValidateTokenResult> {
  if (!token?.trim()) {
    return { success: false, error: 'GitHub Personal Access Token is required' };
  }

  try {
    // 1. Verify user identity
    const userRes = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: getHeaders(token),
    });

    if (userRes.status === 401) {
      return { success: false, error: 'Invalid or expired GitHub Personal Access Token' };
    }

    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `GitHub authentication error (HTTP ${userRes.status})`,
      };
    }

    const userData: any = await userRes.json();
    const user: GitHubUserInfo = {
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      public_repos: userData.public_repos,
    };

    const targetOwner = owner?.trim() || user.login;
    const targetRepo = repoName?.trim();

    // 2. If repository is specified, check existence and permissions
    if (targetRepo) {
      const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}`, {
        headers: getHeaders(token),
      });

      if (repoRes.ok) {
        const repoData: any = await repoRes.json();
        return {
          success: true,
          user,
          repoExists: true,
          repo: {
            name: repoData.name,
            full_name: repoData.full_name,
            html_url: repoData.html_url,
            default_branch: repoData.default_branch || 'main',
            private: repoData.private,
            permissions: repoData.permissions,
          },
        };
      } else if (repoRes.status === 404) {
        return {
          success: true,
          user,
          repoExists: false,
          canCreateRepo: true,
        };
      } else {
        const errData = await repoRes.json().catch(() => ({}));
        return {
          success: true,
          user,
          repoExists: false,
          error: errData.message || `Unable to access repository (HTTP ${repoRes.status})`,
        };
      }
    }

    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to GitHub API' };
  }
}

/**
 * Creates a new GitHub repository for the authenticated user
 */
export async function createGitHubRepository(
  token: string,
  repoName: string,
  isPrivate: boolean = false,
  description: string = 'OffGrid OG - Modern Streetwear Commerce Engine'
): Promise<{ success: boolean; repo?: GitHubRepoInfo; error?: string }> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/user/repos`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: repoName.trim(),
        private: isPrivate,
        description,
        auto_init: true,
      }),
    });

    const data: any = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || `Failed to create repository (HTTP ${res.status})` };
    }

    return {
      success: true,
      repo: {
        name: data.name,
        full_name: data.full_name,
        html_url: data.html_url,
        default_branch: data.default_branch || 'main',
        private: data.private,
        permissions: data.permissions,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error creating GitHub repository' };
  }
}

/**
 * Scans project workspace directory and filters out ignored and sensitive files
 */
export function scanProjectFiles(rootDir: string = process.cwd()): Array<{
  relativePath: string;
  absolutePath: string;
  size: number;
}> {
  const ignoredDirs = new Set([
    'node_modules',
    '.git',
    '.aistudio',
    'dist',
    'build',
    'coverage',
    '.cache',
    '.next',
    '.turbo',
  ]);

  const ignoredFiles = new Set([
    '.DS_Store',
    'Thumbs.db',
    'bun.lock',
  ]);

  const results: Array<{ relativePath: string; absolutePath: string; size: number }> = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      // Exclude ignored directories
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name) || entry.name.startsWith('.git')) {
          continue;
        }
        walk(fullPath);
        continue;
      }

      // Exclude ignored filenames
      if (ignoredFiles.has(entry.name) || entry.name.endsWith('.log')) {
        continue;
      }

      // Exclude secret environment files, but explicitly preserve .env.example
      if (entry.name.startsWith('.env') && entry.name !== '.env.example') {
        continue;
      }

      const stat = fs.statSync(fullPath);
      // Skip files larger than 25MB (GitHub standard limit)
      if (stat.size > 25 * 1024 * 1024) {
        continue;
      }

      results.push({
        relativePath,
        absolutePath: fullPath,
        size: stat.size,
      });
    }
  }

  walk(rootDir);
  return results;
}

/**
 * Concurrency helper to upload files without hitting rate limits
 */
async function runConcurrent<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await task(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Full automated project commit and push to GitHub using Git Data API (Blobs, Trees, Commits, Refs)
 */
export async function pushProjectToGitHub(options: PushOptions): Promise<PushResult> {
  const { token, owner, repo, branch, commitMessage } = options;
  const targetOwner = owner.trim();
  const targetRepo = repo.trim();
  const targetBranch = (branch || 'main').trim();
  const message = commitMessage?.trim() || 'Update OffGrid OG website source code';

  const headers = getHeaders(token);

  try {
    // 1. Verify repository access
    const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}`, { headers });
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return {
          success: false,
          error: `Repository '${targetOwner}/${targetRepo}' was not found. Please verify the name or create it first.`,
        };
      }
      return { success: false, error: `GitHub error accessing repository (HTTP ${repoRes.status})` };
    }

    // 2. Scan workspace files
    const projectFiles = scanProjectFiles();
    if (projectFiles.length === 0) {
      return { success: false, error: 'No valid source code files found to upload in project directory.' };
    }

    console.log(`[GitHub Push] Scanned ${projectFiles.length} files to upload to ${targetOwner}/${targetRepo}`);

    // 3. Upload file blobs concurrently (batch of 8)
    const treeEntries: Array<{ path: string; mode: string; type: string; sha: string }> = [];

    await runConcurrent(projectFiles, 8, async (file) => {
      const fileBuffer = fs.readFileSync(file.absolutePath);
      const base64Content = fileBuffer.toString('base64');

      const blobRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: base64Content,
          encoding: 'base64',
        }),
      });

      if (!blobRes.ok) {
        const errJson = await blobRes.json().catch(() => ({}));
        throw new Error(`Failed to upload blob for ${file.relativePath}: ${errJson.message || blobRes.statusText}`);
      }

      const blobData: any = await blobRes.json();
      treeEntries.push({
        path: file.relativePath,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      });
    });

    // 4. Create Git Tree
    const treeRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tree: treeEntries,
      }),
    });

    if (!treeRes.ok) {
      const errJson = await treeRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create Git Tree: ${errJson.message || treeRes.statusText}` };
    }

    const treeData: any = await treeRes.json();
    const treeSha = treeData.sha;

    // 5. Get current commit on branch (parent commit)
    let parentSha: string | null = null;
    const refRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/ref/heads/${targetBranch}`, {
      headers,
    });

    if (refRes.ok) {
      const refData: any = await refRes.json();
      parentSha = refData.object.sha;
    } else {
      // If target branch ref doesn't exist, check default branch or fallback
      const defaultRefRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/ref/heads/main`, {
        headers,
      });
      if (defaultRefRes.ok) {
        const defaultRefData: any = await defaultRefRes.json();
        parentSha = defaultRefData.object.sha;
      }
    }

    // 6. Create Git Commit
    const commitBody: any = {
      message,
      tree: treeSha,
      parents: parentSha ? [parentSha] : [],
    };

    const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(commitBody),
    });

    if (!commitRes.ok) {
      const errJson = await commitRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create Git Commit: ${errJson.message || commitRes.statusText}` };
    }

    const commitData: any = await commitRes.json();
    const commitSha = commitData.sha;

    // 7. Update branch ref (or create if it didn't exist)
    if (refRes.ok) {
      const updateRefRes = await fetch(
        `${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/refs/heads/${targetBranch}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            sha: commitSha,
            force: true,
          }),
        }
      );

      if (!updateRefRes.ok) {
        const errJson = await updateRefRes.json().catch(() => ({}));
        return { success: false, error: `Failed to update branch reference: ${errJson.message || updateRefRes.statusText}` };
      }
    } else {
      const createRefRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${targetBranch}`,
          sha: commitSha,
        }),
      });

      if (!createRefRes.ok) {
        const errJson = await createRefRes.json().catch(() => ({}));
        return { success: false, error: `Failed to create branch reference: ${errJson.message || createRefRes.statusText}` };
      }
    }

    // 8. Verify commit
    const verifyRes = await fetch(`${GITHUB_API_BASE}/repos/${targetOwner}/${targetRepo}/commits/${commitSha}`, {
      headers,
    });

    const repoUrl = `https://github.com/${targetOwner}/${targetRepo}`;
    const commitUrl = `https://github.com/${targetOwner}/${targetRepo}/commit/${commitSha}`;

    console.log(`[GitHub Push] Successfully pushed commit ${commitSha.substring(0, 7)} to ${repoUrl}/tree/${targetBranch}`);

    return {
      success: true,
      repoUrl,
      commitUrl,
      commitSha,
      branch: targetBranch,
      filesCount: projectFiles.length,
      uploadedFiles: projectFiles.map((f) => f.relativePath),
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('[GitHub Push Error]', err);
    return { success: false, error: err.message || 'Unexpected error during GitHub project upload' };
  }
}
