# Automatic Semantic Versioning

This repository uses **automatic semantic versioning** for deployment packages. The version number is automatically incremented based on your commit message, following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## How It Works

### Automatic Version Increment

When you push to `main` or `release/*` branches, the workflow automatically:

1. Reads the last git tag (e.g., `v1.2.3`)
2. Analyzes your commit message to determine the type of change
3. Increments the version accordingly
4. Creates a new git tag with the new version
5. Generates deployment package with the new version

### Version Bump Rules

The version bump type is determined by your **commit message prefix**:

| Commit Message Prefix | Version Bump | Example |
|----------------------|--------------|---------|
| `major:` or `BREAKING CHANGE:` | **Major** (X.0.0) | `v1.2.3` → `v2.0.0` |
| `feat:` or `feature:` or `minor:` | **Minor** (x.Y.0) | `v1.2.3` → `v1.3.0` |
| `fix:`, `chore:`, `docs:`, etc. | **Patch** (x.y.Z) | `v1.2.3` → `v1.2.4` |

### Commit Message Examples

#### Patch Version (Bug fixes, small changes)
```bash
git commit -m "fix: corregir validación de fechas en formulario"
git commit -m "chore: actualizar dependencias"
git commit -m "docs: mejorar documentación de API"
```
Result: `v1.2.3` → `v1.2.4`

#### Minor Version (New features, backward-compatible)
```bash
git commit -m "feat: agregar nuevo campo de selección múltiple"
git commit -m "feature: implementar carga de archivos PDF"
git commit -m "minor: nuevo componente de calendario"
```
Result: `v1.2.3` → `v1.3.0`

#### Major Version (Breaking changes)
```bash
git commit -m "major: cambiar estructura de datos del formulario"
git commit -m "BREAKING CHANGE: eliminar compatibilidad con API v1"
```
Result: `v1.2.3` → `v2.0.0`

## Manual Version Override

You can still specify the version manually by triggering the workflow from GitHub Actions UI:

1. Go to **Actions** → **Build Deployment Package (Offline)**
2. Click **Run workflow**
3. Enter custom version (e.g., `2.5.0`)
4. Optionally add release notes

This will:
- Use your specified version (no auto-increment)
- Create a GitHub Release with release notes
- Skip automatic tag creation (manual trigger)

## Initial Setup

If this is a new repository without tags, the workflow starts at `v1.0.0` by default.

To set a different starting version:

```bash
# Create initial tag
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Best Practices

### Conventional Commits Format

Follow this format for clear versioning:

```
<type>: <short description>

<optional detailed description>

<optional footer with breaking changes>
```

**Examples:**

```bash
# Simple commit
git commit -m "fix: resolver error de validación en campo email"

# With body
git commit -m "feat: agregar soporte para archivos ZIP

Permite subir archivos ZIP hasta 50MB
Incluye validación de contenido
Mejora UX con barra de progreso"

# Breaking change
git commit -m "major: cambiar API de autenticación

BREAKING CHANGE: El endpoint /auth/login ahora requiere
header Authorization con formato Bearer token"
```

### Common Commit Types

| Type | Usage | Version Bump |
|------|-------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | Patch |
| `style` | Formatting, missing semicolons | Patch |
| `refactor` | Code restructuring | Patch |
| `perf` | Performance improvements | Patch |
| `test` | Adding tests | Patch |
| `chore` | Maintenance tasks | Patch |
| `major` | Breaking changes | Major |

### Multiple Changes

If you have multiple changes, use the **most significant** type:

- Bug fix + new feature → Use `feat:` (minor bump)
- Multiple bug fixes → Use `fix:` (patch bump)
- New feature + breaking change → Use `major:` (major bump)

## Workflow Triggers

The automatic versioning workflow runs on:

1. **Push to `main` branch** with changes in:
   - `*/src/**` (any form source code)
   - `*/package.json` (any form package.json)
   - `build-form.js` (shared build script)

2. **Manual trigger** from GitHub Actions UI (with custom version input)

## Version Tag Format

All version tags follow the format: `vX.Y.Z`

- `v` prefix (lowercase)
- Semantic versioning: `MAJOR.MINOR.PATCH`
- Examples: `v1.0.0`, `v2.3.5`, `v10.5.12`

## Deployment Package Naming

Deployment packages are named: `bizuit-custom-forms-deployment-{VERSION}.zip`

Examples:
- `bizuit-custom-forms-deployment-1.2.3.zip`
- `bizuit-custom-forms-deployment-2.0.0.zip`

## Troubleshooting

### Tag Already Exists

If you see "Tag already exists" error, it means a version was already created. This can happen if:

1. The workflow ran twice (rare)
2. A manual tag was created

**Solution:** The workflow will skip tag creation automatically. Next commit will increment from the existing tag.

### Wrong Version Bump

If the version bumped incorrectly, you can:

1. Delete the incorrect tag:
   ```bash
   git tag -d v1.2.3
   git push origin :refs/tags/v1.2.3
   ```

2. Create a new commit with the correct prefix:
   ```bash
   git commit -m "feat: correct feature description"
   git push
   ```

### Reset Version Sequence

To restart versioning from a specific version:

```bash
# Delete all tags (careful!)
git tag -l | xargs git tag -d
git push origin --delete $(git tag -l)

# Create new starting tag
git tag -a v2.0.0 -m "Reset to v2.0.0"
git push origin v2.0.0
```

## Advanced: Customizing Version Logic

To modify the version increment logic, edit [`.github/workflows/build-deployment-package.yml`](.github/workflows/build-deployment-package.yml):

```yaml
# Lines 45-100: Get version info step
# Modify the regex patterns to match different commit message formats
```

Example customizations:

```bash
# Add custom prefix for minor version
elif echo "$COMMIT_MSG" | grep -qiE "^(feat|feature|minor|add):"; then

# Change major version detection
if echo "$COMMIT_MSG" | grep -qiE "^(breaking|major|v2):"; then
```

## Traceability in Custom Forms Admin UI

When you upload a deployment package to the custom forms server, the **commit information is preserved** and displayed in the admin interface:

### What You'll See

1. **Forms Management Page** (`/admin/forms`):
   - Each form displays its current version
   - Click "Versions" button to see version history

2. **Version History Modal**:
   - **Package Version**: Auto-incremented semantic version (e.g., `1.2.3`)
   - **Commit Hash**: Short hash (e.g., `a7b3c9f`) - **clickable link** to view the commit
   - **Build Date**: When the package was built
   - **Release Notes**: Extracted from commit message

### Commit Link

The commit hash is a **clickable link** that opens the full commit in your git provider:
- **GitHub**: `https://github.com/your-org/repo/commit/{hash}`
- **GitLab**: `https://gitlab.com/your-org/repo/-/commit/{hash}`
- **Bitbucket**: `https://bitbucket.org/your-org/repo/commits/{hash}`
- **Azure DevOps**: `https://dev.azure.com/org/project/_git/repo/commit/{hash}`

The URL is automatically generated from the `commitUrl` field in `manifest.json`, which is set by the workflow based on your repository URL.

### How It Works

1. **Workflow** generates `manifest.json` with:
   ```json
   {
     "packageVersion": "1.2.3",
     "commitHash": "a7b3c9f1234567890abcdef...",
     "commitShortHash": "a7b3c9f",
     "commitUrl": "https://github.com/your-org/repo/commit/a7b3c9f...",
     "repositoryUrl": "https://github.com/your-org/repo",
     "buildDate": "2025-11-20T19:45:00.000Z"
   }
   ```

2. **Backend API** stores this metadata in SQL Server (`CustomFormVersions` table)

3. **Admin UI** displays the commit hash as a clickable link

### Benefits

- **Full traceability**: From deployed form → version → commit → code changes
- **Quick debugging**: Click commit hash to see exactly what code is running
- **Version confidence**: Know exactly which git commit each version came from
- **Audit trail**: Track deployment history with git integration

## Related Documentation

- [GitHub Actions Workflow](.github/workflows/build-deployment-package.yml)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
