---
name: bug-report
description: Creates a bug report (or enhancement) in GitHub using a template and adds it to CZERTAINLY project #5 with Severity, Version fields and parent issue #97 linked.
argument-hint: <owner/repo>
allowed-tools: Bash(gh *), Write
---

Create a GitHub issue for the CZERTAINLY project.

## Prerequisites

Detect the `gh` CLI path:
```
which gh || /opt/homebrew/bin/gh --version || gh --version
```
Use whichever path works. On macOS with Homebrew it is typically `/opt/homebrew/bin/gh`. Save as `{gh}` for all subsequent commands.

Check authentication:
```
{gh} auth status
```
If not authenticated, instruct the user to run:
```
{gh} auth login -h github.com -s project
```
and wait for confirmation before proceeding.

## Step 1: Gather information

Ask the user in English only for:
- **Repository**: GitHub repo name (default: `CZERTAINLY/CZERTAINLY-FE-Administrator`)
- **Type**: `bug` or `enhancement` (default: `bug`)
- **Problem summary**: a brief free-form description of the issue

Save the owner and repo name separately from the repository value (e.g. `CZERTAINLY` and `CZERTAINLY-FE-Administrator`).

Generate everything else yourself:
- **Title**: derive the breadcrumb from the problem context, format: `Section - Subsection - Page: Short issue summary`
- **Description**: professional English, industry-standard — clear problem statement, context, impact. Use **bold** for UI elements, `backticks` for code/paths
- **Steps to Reproduce**: derive from the breadcrumb and context
- **Expected Result**: bullet list
- **Actual Result**: bullet list
- **Severity**: assess and propose (`Minor`, `Major`, `Critical`, `Blocker`) with a one-line rationale
- **Attachments**: never ask — user adds manually via GitHub web UI after issue creation

## Step 2: Build the issue body

Write the body to `/tmp/bug-report-body.md` using this exact structure (replace placeholders):

    ## Description
    {description}

    ## Steps to Reproduce
    {steps}

    ## Expected Result
    {expected}

    ## Actual Result
    {actual}

    ## Environment
    Frontend (czertainly-administrator):

    ILM Core:
    Commit:
    Branch:
    Build time:

    Client:
    - OS:
    - Browser:

    ## Attachments

Do not ask the user for environment details. Leave placeholders empty if unknown.

## Step 3: Preview and confirm

Show the user the full formatted issue body as it will appear in GitHub. Ask: **"Looks good? Shall we create the issue?"** — and wait for confirmation before proceeding.

## Step 4: Create the GitHub issue

For **bug** type:
```
{gh} issue create --repo {repository} --title "{title}" --body-file /tmp/bug-report-body.md --label "bug"
```

For **enhancement** type:
```
{gh} issue create --repo {repository} --title "{title}" --body-file /tmp/bug-report-body.md --label "bug" --label "enhancement"
```

Save the issue URL and extract the issue number from it.
Get the issue node ID:
```
{gh} api graphql -f query='query { repository(owner: "{owner}", name: "{repo_name}") { issue(number: {issue_number}) { id } } }' --jq '.data.repository.issue.id'
```

## Step 5: Set issue Type (REQUIRED)

Use the issue node ID from Step 4. Issue type IDs:
- Bug: `IT_kwDOB4ppKM4BH8iD`
- Feature: `IT_kwDOB4ppKM4BH8iF`
- Task: `IT_kwDOB4ppKM4BH8iB`

```
{gh} api graphql -f query='mutation { updateIssue(input: {id: "{issue_node_id}", issueTypeId: "{type_id}"}) { issue { number issueType { name } } } }'
```

## Step 6: Add to GitHub Project #5

```
{gh} project item-add 5 --owner CZERTAINLY --url {issue_url} --format json
```

Save the item node ID (`id` field) from the JSON response.

## Step 7: Set Severity and Version custom fields

Use these known IDs directly (no need to query):
- Project node ID: `PVT_kwDOB4ppKM4AlVOh`
- Severity field ID: `PVTSSF_lADOB4ppKM4AlVOhzg7dshs`
  - Minor: `55e8859d`, Major: `9bcee5f9`, Critical: `dc153822`, Blocker: `600ce1e4`
- Version field ID: `PVTSSF_lADOB4ppKM4AlVOhzgh6phM`
  - 2.17.0: `ec385213`

Set Severity:
```
{gh} project item-edit --id {item_node_id} --project-id PVT_kwDOB4ppKM4AlVOh --field-id PVTSSF_lADOB4ppKM4AlVOhzg7dshs --single-select-option-id {severity_option_id}
```

Set Version to "2.17.0":
```
{gh} project item-edit --id {item_node_id} --project-id PVT_kwDOB4ppKM4AlVOh --field-id PVTSSF_lADOB4ppKM4AlVOhzgh6phM --single-select-option-id ec385213
```

## Step 8: Link parent issue #97

Parent issue node ID: `I_kwDOGbB6e87wYgcP`

Add the new issue as sub-issue of CZERTAINLY/CZERTAINLY#97 using GraphQL (REST API does not work):
```
{gh} api graphql -f query='mutation { addSubIssue(input: {issueId: "I_kwDOGbB6e87wYgcP", subIssueId: "{new_issue_node_id}"}) { issue { number } subIssue { number } } }'
```

## Step 9: Open in browser and report result

Open the issue in the browser so the user can add attachments:
```
{gh} issue view {issue_url} --web
```

Show the user:
- Issue URL (clickable)
- Type, Severity and Version fields set in project
- Confirmation that parent issue #97 was linked
- Reminder to add attachments in the browser tab that just opened
