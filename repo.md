# Repository Setup Commands

## AI Prompt for Project Rename

```
Please rename this React project from "react-component-viewer-sandbox" to "react-ui-sandbox-preview". 

Update all references to the project name in:
1. package.json name field
2. README.md title and any references 
3. app/layout.tsx metadata title
4. Any other files that reference the old project name

The new name "react-ui-sandbox-preview" better reflects the purpose: a sandbox environment for previewing React UI components that can be easily pasted and stored.

Keep all other functionality, author attribution (Remco Stoeten), and existing content intact - only update the project name references.
```

## GitHub CLI Setup Commands

```bash
# Stage and commit changes
git add .
git commit -m "Rename project to react-ui-sandbox-preview"

# Create new repository (preserving good defaults)
gh repo create react-ui-sandbox-preview --public --description "Instantly preview React UI components in a secure sandbox - paste, preview, and store components without local setup"

# Add remote and push
git remote add origin git@github.com:remcostoeten/react-ui-sandbox-preview.git
git push -u origin master

# Add topics for discoverability
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "react"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "ui-components"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "sandbox"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "component-preview"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "nextjs"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "typescript"
gh repo edit remcostoeten/react-ui-sandbox-preview --add-topic "tailwindcss"

# Set repository description
gh repo edit remcostoeten/react-ui-sandbox-preview --description "Instantly preview React UI components in a secure sandbox - paste, preview, and store components without local setup"

# Configure merge request settings (title + description required)
gh api -X PATCH repos/remcostoeten/react-ui-sandbox-preview -f pull_request_template_title_required=true -f pull_request_template_description_required=true

# Disable projects
gh api -X PATCH repos/remcostoeten/react-ui-sandbox-preview -f has_projects=false

# Disable issues
gh api -X PATCH repos/remcostoeten/react-ui-sandbox-preview -f has_issues=false

# Enable auto-merge (good default)
gh repo edit remcostoeten/react-ui-sandbox-preview --enable-auto-merge

# Set default branch to master
gh api -X PATCH repos/remcostoeten/react-ui-sandbox-preview -f default_branch=master

# Enable security features (good defaults)
gh api -X PATCH repos/remcostoeten/react-ui-sandbox-preview -f security_and_analysis='{"advanced_security":{"status":"enabled"},"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}'
```

## Repository Configuration Summary

- **Name**: react-ui-sandbox-preview
- **Description**: Instantly preview React UI components in a secure sandbox
- **Topics**: react, ui-components, sandbox, component-preview, nextjs, typescript, tailwindcss
- **Branch**: master (default)
- **Issues**: Disabled
- **Projects**: Disabled
- **Auto-merge**: Enabled
- **Security**: Advanced Security, Secret Scanning enabled
- **Merge Requirements**: Title + description required

## Good Defaults Preserved

- Public repository
- Master branch as default
- Auto-merge enabled
- Security features enabled
- Clear, descriptive topics for discoverability
- Professional description for SEO and GitHub search
