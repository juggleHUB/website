# AI Content Editor for Astro Sites

## Overview

A lightweight web dashboard that lets non-technical clients edit content on their Astro static sites via natural language prompts. The system uses AI to modify structured JSON content, validates changes against Zod schemas, and leverages Netlify branch deploys as the critical preview-before-go-live step.

## Requirements

- Non-technical clients can edit existing page content via AI prompts
- Clients write freeform prompts (e.g., "On the homepage, make the hero headline more punchy and mention summer") — no page selection required
- Preview of changes on a live Netlify deploy before going live (critical requirement)
- Simple passcode authentication (one passcode per client)
- Support for image uploads (replace existing images)
- Support for bilingual content (DE/EN)
- Reusable across multiple client sites

## Architecture

### Deployment Model

One standalone dashboard instance per client site, deployed to its own Netlify site. Each instance is configured via environment variables:

- `GITHUB_REPO`: The client's GitHub repository (e.g., `owner/jugglehub-website`)
- `GITHUB_TOKEN`: Personal access token with repo access
- `NETLIFY_SITE_ID`: The client's Netlify site ID
- `NETLIFY_API_TOKEN`: Netlify API token
- `CLIENT_PASSCODE`: Shared secret for dashboard access
- `AI_API_KEY`: API key for the AI provider (OpenAI/Anthropic)
- `CONTENT_PATH`: Path to content files in the repo (default: `src/content`)

### Components

#### Frontend Dashboard

A single-page Astro application with minimal UI:

1. **Passcode Gate**: Simple form to enter the client passcode
2. **Prompt Interface**: Textarea for the AI prompt + optional image upload
3. **Loading State**: Shows progress while AI generates changes and deploy is building
4. **Diff View**: Shows which files changed and field-level modifications
5. **Preview Link**: Button to open the Netlify deploy preview in a new tab
6. **Approve/Retry**: Buttons to merge to main or try again with a new prompt

#### Backend (Netlify Functions)

- **`/api/generate`**: Takes a prompt + optional image context, loads all content schemas and current JSON from GitHub, calls the AI, returns proposed changes with field-level diffs
- **`/api/preview`**: Creates a branch, commits the changed JSON files, triggers a Netlify deploy, polls for completion, returns the preview URL
- **`/api/approve`**: Merges the preview branch to main
- **`/api/upload`**: Handles image uploads, commits images to the repo (e.g., `public/uploads/`), returns the committed path for use in JSON updates

### AI Integration

#### Input to AI

The AI receives:

1. **All content collection schemas** (from `config.ts`) — defines the structure and allowed fields for each content type
2. **All current content JSON files** — the actual content values
3. **The user's prompt** — what they want to change
4. **Image paths** (if images were uploaded) — new image paths that can be referenced

#### Output from AI

The AI returns:

1. **Modified JSON files** — only the files that changed, with updated values
2. **Change summary** — human-readable description of what was changed (e.g., "Updated homepage hero headline in both German and English")

#### Validation

Before showing the diff to the client:

1. Parse the AI's JSON output
2. Validate each modified file against its Zod schema
3. If validation fails, retry with error context or show an error to the client
4. Only proceed if all changes are schema-valid

#### Language Handling

The content is bilingual (DE/EN). The AI should:

- If the prompt is written in German, update the `de` content by default
- If the prompt is written in English, update the `en` content by default
- If the prompt explicitly specifies a language (e.g., "update the German homepage"), update that language
- If the prompt is ambiguous, the AI can update both languages or ask for clarification in the change summary
- The diff view will show which languages were affected, so the client can review and reject if needed

### Preview & Approval Flow

```
1. Client enters passcode → authenticated
2. Client types prompt: "On the homepage, make the hero headline more punchy"
3. Dashboard calls /api/generate with:
   - Prompt
   - All schemas (from config.ts)
   - All current content JSON
4. AI generates modified JSON files
5. Backend validates against Zod schemas
6. Backend computes field-level diff and returns to dashboard
7. Dashboard shows diff: "Homepage (de): hero_headline changed from 'X' to 'Y'"
8. Client clicks "Preview"
9. Dashboard calls /api/preview:
   - Creates branch: `content-edit-{timestamp}`
   - Commits changed JSON files to the branch
   - Pushes to GitHub
   - Triggers Netlify deploy for the branch
   - Polls Netlify API until deploy completes
   - Returns preview URL
10. Dashboard shows preview URL + "Open Preview" button
11. Client opens preview in new tab, reviews the actual rendered site
12. Client returns to dashboard
13. Client clicks "Approve":
    - Dashboard calls /api/approve
    - Backend merges the branch to main
    - Netlify auto-deploys main → changes go live
14. OR: Client clicks "Try Again" → new prompt, new branch, repeat
```

### Image Upload Flow

```
1. Client uploads an image (drag-and-drop or file picker)
2. Dashboard calls /api/upload:
   - Image is committed to the repo at `public/uploads/{filename}`
   - Returns the committed path (e.g., `/uploads/image-123.png`)
3. Client includes the image in their prompt: "Replace the hero image with the uploaded image"
4. AI generates modified JSON with the new image path
5. Preview flow continues as above
```

### Error Handling

- **AI validation failure**: If the AI's output doesn't match the Zod schema, retry once with error context. If it fails again, show an error to the client: "The AI couldn't generate valid changes. Try rephrasing your prompt."
- **Deploy failure**: If the Netlify deploy fails, show the error and allow the client to retry or contact support.
- **GitHub API errors**: Handle rate limits, auth failures, and network errors gracefully with user-friendly messages.
- **Merge conflicts**: If the branch can't be merged to main (e.g., someone else pushed changes), show an error and suggest retrying.

## Configuration

Each client instance is configured via a simple config file or environment variables:

```javascript
// config.js
export default {
  github: {
    repo: 'owner/jugglehub-website',
    token: process.env.GITHUB_TOKEN,
  },
  netlify: {
    siteId: process.env.NETLIFY_SITE_ID,
    apiToken: process.env.NETLIFY_API_TOKEN,
  },
  auth: {
    passcode: process.env.CLIENT_PASSCODE,
  },
  ai: {
    provider: 'openai', // or 'anthropic'
    apiKey: process.env.AI_API_KEY,
    model: 'gpt-4o', // or 'claude-3-5-sonnet-20241022'
  },
  content: {
    path: 'src/content',
    schemaFile: 'src/content/config.ts',
  },
};
```

## Future Enhancements

These features can be layered in after the core flow is working:

1. **Rendered content preview**: Show the current content in a more readable format before the client types a prompt
2. **Section scoping**: Let clients drill into specific sections (e.g., "Homepage > Hero") for tighter AI context
3. **Edit history**: Track what changed, when, and why (prompt + diff)
4. **Rollback**: Easily revert to a previous version if a change doesn't work out
5. **Multi-language explicit control**: Let clients specify which language(s) to update in the UI
6. **Batch edits**: Let clients queue multiple prompts before generating a single preview
7. **Collaboration**: Multiple clients can review and approve changes (with comments)

## Technical Notes

### Schema Loading

The Zod schemas are defined in TypeScript (`src/content/config.ts`). For the AI integration:

- Option 1: Send the TypeScript source to the AI (it can understand Zod schemas)
- Option 2: Parse the schemas and convert to JSON Schema, then send JSON Schema to the AI
- Recommendation: Start with Option 1 (simpler), migrate to Option 2 if we need better validation or if the AI struggles with TypeScript

### Content File Discovery

The backend needs to discover all content JSON files. It can:

1. Read the `config.ts` to get the list of collections
2. For each collection, read the corresponding JSON file(s)
3. Pass all of this to the AI

### Branch Naming

Use a consistent naming scheme for preview branches:

- `content-edit-{timestamp}` (e.g., `content-edit-20250716-143022`)
- Or `content-edit-{random-id}` (e.g., `content-edit-a1b2c3`)

### Netlify Deploy Status

After pushing to GitHub, the backend needs to poll the Netlify API to check when the deploy is ready:

```
GET https://api.netlify.com/api/v1/sites/{site_id}/deploys?branch={branch_name}
```

Poll every 5-10 seconds until the deploy status is `ready`.

### GitHub Merge

To merge the branch to main:

```
POST https://api.github.com/repos/{owner}/{repo}/merges
{
  "base": "main",
  "head": "content-edit-{timestamp}",
  "commit_message": "Content update: {summary}"
}
```

If the merge fails (conflicts), show an error to the client.

## Success Criteria

The system is successful if:

1. Non-technical clients can edit content without developer assistance
2. Clients always see a live preview before changes go live
3. The AI generates schema-valid content that doesn't break the site
4. The entire flow (prompt → preview → approve) takes less than 2 minutes
5. Clients feel confident making changes without fear of breaking the site
