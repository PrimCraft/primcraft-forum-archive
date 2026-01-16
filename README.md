# PrimCraft Forum Archive

Read-only archive of the PrimCraft forum (Xiuno BBS) at [primcraft.com/forum-archive](https://primcraft.com/forum-archive/). The original forum stopped operating in 2019.

## Tech Stack

- **Jekyll** - Static site generator with `jekyll-datapage-generator` and `jekyll-sitemap` plugins
- **Bulma** - CSS framework (managed via pnpm)
- **lightningcss** - CSS bundling and minification
- **PurgeCSS** - Removes unused CSS
- **Pagefind** - Static search indexing
- **pnpm** - Package manager

## Development

### Setup

```bash
bundle install
pnpm install
```

### Commands

```bash
pnpm serve        # Build + dev server with watch (port 4000)
pnpm build        # Full build (Jekyll + CSS + PurgeCSS + Pagefind)
pnpm clean        # Remove build artifacts
pnpm format       # Format HTML/Liquid files with Prettier
pnpm format:check # Check formatting
```

### Updating Bulma

```bash
pnpm update bulma
```

Bulma follows semver - minor versions are non-breaking.

## Project Structure

```
├── _config.yml           # Jekyll config + data page generator settings
├── _data/
│   └── forum_archive.json  # Forum data (forums, threads, posts, users, tags)
├── _includes/
│   ├── header.html       # Site header with navigation
│   ├── footer.html       # Site footer
│   ├── hero.html         # Reusable hero section with breadcrumbs
│   ├── meta.html         # Meta tags (description, canonical, Open Graph)
│   ├── post.html         # Individual post rendering
│   ├── forum_badge.html  # Forum name badge with color
│   ├── thread_tags.html  # Thread tags display
│   ├── user_link.html    # User profile link
│   └── user_sidebar.html # User info sidebar
├── _layouts/
│   ├── default.html      # Base layout
│   ├── forum.html        # Forum listing page
│   ├── thread.html       # Thread with posts
│   ├── user.html         # User profile
│   └── user_posts.html   # User's post history
├── assets/
│   ├── css/
│   │   ├── bulma.min.css # Generated from node_modules (not in git)
│   │   ├── custom.css    # Custom styles
│   │   └── tag-colors.css # Generated tag/forum colors (Liquid)
│   └── upload/           # User uploads (not in git, synced separately)
├── index.html            # Homepage - all threads sorted by last reply
├── forums.html           # Forum listing
├── search.html           # Pagefind search page
└── robots.txt            # Crawler rules + sitemap reference
```

## Data

Forum data is stored in `_data/forum_archive.json` with the following structure:

- `forums` - Forum categories
- `threads` - Thread metadata
- `posts` - Post content (HTML)
- `users` - User profiles
- `tags` - Thread tags
- `thread_tags` - Thread-tag relationships

## Deployment

Deployed via GitHub Actions on push to `main`:

1. Checks formatting with Prettier
2. Builds Jekyll site
3. Indexes with Pagefind
4. Syncs to S3
5. Invalidates CloudFront cache

Required GitHub secrets/variables:
- `AWS_REGION` (variable)
- `AWS_ROLE_ARN` (secret) - OIDC role for AWS access
- `S3_BUCKET` (secret)
- `S3_PREFIX` (secret)
- `CLOUDFRONT_DISTRIBUTION_ID` (secret, optional)
