# GitHub MCP Setup — miketui/Website

Connect Claude Desktop (or Claude Code) to the GitHub MCP server so you can
query issues, pull requests, Actions runs, and code from this repo directly
inside a conversation.

---

## 1. Create a GitHub Personal Access Token

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens** (or classic tokens).
2. Click **Generate new token**.
3. Set **Repository access** to **Only selected repositories → miketui/Website**.
4. Grant these permissions (fine-grained scopes):
   - **Contents** — Read & write (clone, file reads, commits)
   - **Issues** — Read & write
   - **Pull requests** — Read & write
   - **Actions** — Read (CI run visibility)
   - **Metadata** — Read (always required)
5. Copy the token. You will not see it again.

> Keep this token out of the repo. Never paste it into `.env.example`,
> `package.json`, or any tracked file.

---

## 2. Configure Claude Desktop

The config file location depends on your OS:

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

Open that file (create it if it does not exist) and add the `mcpServers` block.
If you already have other MCP entries, merge — do not overwrite the whole file.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Replace `ghp_YOUR_TOKEN_HERE` with the token you copied in Step 1.

> **Node.js required.** The `npx` command needs Node.js ≥ 18 on your PATH.
> Verify with `node --version` in a terminal.

---

## 3. Restart Claude Desktop

Fully quit and reopen the app. The GitHub MCP server starts automatically on the
next session.

---

## 4. Verify the connection

In a new Claude Desktop conversation, try:

```
List the open pull requests in miketui/Website.
```

If the MCP server is active you will see live PR data. If not, check the
**Developer → MCP Logs** panel (macOS: menu bar → Claude → Developer) for
connection errors.

---

## 5. Repo-local config for Claude Code (`.mcp.json`)

The `.mcp.json` at the repo root is for Claude Code sessions. It references the
token from your shell environment instead of hardcoding it:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

Export the token before starting Claude Code:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_YOUR_TOKEN_HERE"
```

Or add the export to your `~/.zshrc` / `~/.bashrc` so it is always available.

---

## Security notes

- Never commit your PAT. `.mcp.local.json` is gitignored as an extra safety net.
- Rotate the token if it is ever exposed.
- The fine-grained token scoped to only this repo limits blast radius if
  compromised.
- The MCP server runs locally on your machine; no token leaves your system via
  this setup.
