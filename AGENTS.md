# Agent Instructions

Jekyll static site preserving the PrimCraft forum (originally Xiuno BBS, closed 2019) as a read-only archive. The site content is static, but this project is actively maintained. See [README.md](README.md) for setup, commands, and project structure.

## Quick Reference

- `pnpm build` - Jekyll + lightningcss + PurgeCSS + Pagefind
- `pnpm serve` - Build + dev server with watch (port 4000)
- `pnpm format` - Prettier formatting
- `pnpm update bulma` - Upgrade Bulma (semver, minor = non-breaking)
- Data lives in `_data/forum_archive.json`
- Pages generated via `jekyll-datapage-generator` (see `_config.yml`)

## Pitfalls

### Search page empty

Search requires Pagefind, which only runs during initial build. If running Jekyll directly (`bundle exec jekyll serve`) or after Jekyll's watch rebuilds, `/search/` may be empty or stale. Restart `pnpm serve` to rebuild the search index.

### Bulma columns overflow on mobile

Bulma `.columns` has negative margins (`-0.75rem`) that cause horizontal scrollbar on mobile. Already fixed in `custom.css` by zeroing margins/padding:

```css
.columns {
    margin-left: 0;
    margin-right: 0;
}
```

### Breadcrumb overflow with long titles

Long thread subjects can break the page. Fixed with `text-overflow: ellipsis` on the last breadcrumb item (the subject). There's also a fallback on the whole breadcrumb container in case that fails.

```css
.breadcrumb li:last-child {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

Don't apply truncation to all `li` elements - it unnecessarily compresses the first items (Home, Forum name).

### Liquid empty string is truthy

In Liquid, `""` (empty string) is truthy. If checking optional fields like `tag.style`, use `.size > 0`:

```liquid
{% if tag.style.size > 0 %}
```

Not just `{% if tag.style %}` which would be true for `""`.

### CSS build pipeline

`assets/css/bulma.min.css` is copied from `node_modules/bulma/` during build. All CSS files are bundled by lightningcss into `styles.css`, then purged of unused styles. Don't edit `bulma.min.css` directly - it's in `.gitignore`.

During `pnpm serve`, Jekyll's watch mode only rebuilds HTML/Liquid changes. CSS changes require restarting serve (or running `pnpm build`) to rebundle.

### tag-colors.css not auto-formatted

`assets/css/tag-colors.css` uses Liquid templating but `prettier-plugin-liquid` only supports HTML files, not CSS. This file must be formatted manually if changed.

### macOS Ruby PATH issue

If you see this error:

```
Could not find 'bundler' (4.0.3) required by your Gemfile.lock
/System/Library/Frameworks/Ruby.framework/Versions/2.6/...
```

The system Ruby (2.6) is being used instead of Homebrew Ruby. Fix by adding to `~/.zshrc`:

```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

Then restart the terminal or run `source ~/.zshrc`.

## Page Types and Meta Tags

Page types are set via front matter defaults in `_config.yml` based on path:

| Path | `page.page_type` |
|------|------------------|
| `thread/*` | `thread` |
| `forum/*` | `forum` |
| `user/*` | `user` |
| `user-posts/*` | `user` |

`_includes/meta.html` uses `page.page_type` to generate appropriate Open Graph tags:

| Page Type | og:type | og:description | og:image |
|-----------|---------|----------------|----------|
| thread | article | First post content (truncated 160 chars) | First image attachment |
| forum | website | Forum brief | - |
| user | profile | "{username}的个人主页" | - |
| (default) | website | Site description | - |

Thread images are sourced from `attachments` in `forum_archive.json`, filtered by `tid`, `pid` (must match `firstpid`), and `isimage: true`.

### Why front matter defaults?

We use `_config.yml` front matter defaults instead of other approaches:

- **Not `page.layout`**: For generated pages, `page.layout` is always `default` (the parent layout), not `thread`/`forum`/`user` - Jekyll reports the final layout in the chain.
- **Not `{% assign %}` in layouts**: Variables set in child layouts (e.g., thread.html) aren't visible in parent layouts (default.html) due to Liquid's template scoping.
- **Not checking data fields** (e.g., `page.tid`): Works but is implicit. Front matter defaults make the page type explicit and configurable.

Path-based defaults in `_config.yml` are the cleanest solution - they're declarative, don't require modifying the data source, and `page.page_type` is available everywhere in the render chain.
