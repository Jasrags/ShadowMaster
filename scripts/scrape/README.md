# Shadowrun Wiki Scraping Tools

This directory contains scripts for downloading and converting Shadowrun wiki pages from the sitemap into markdown format.

## Overview

The scraping process is divided into two phases:

1. **Download Phase**: Download HTML pages from the wiki with anti-detection measures
2. **Conversion Phase**: Convert downloaded HTML files to high-quality markdown

## Installation

Install the required dependencies:

```bash
pip install -r scripts/scrape/requirements-scrape.txt
```

Or install individually:

```bash
pip install requests beautifulsoup4 lxml trafilatura markdownify tqdm
```

## Usage

### Phase 1: Download HTML Pages

Download HTML pages from the sitemap:

```bash
# Download first 5 pages for testing (with default 3-7 second delays)
python scripts/scrape/download_html.py --limit 5

# Download all pages with default rate limiting
python scripts/scrape/download_html.py

# Download with custom delay range (slower, more conservative)
python scripts/scrape/download_html.py --min-delay 5 --max-delay 10

# Download with faster delays (use with caution, may trigger rate limits)
python scripts/scrape/download_html.py --min-delay 1 --max-delay 3

# Check and respect robots.txt
python scripts/scrape/download_html.py --check-robots

# Verbose logging
python scripts/scrape/download_html.py --verbose
```

**Options:**
- `--sitemap`: Path to sitemap.xml (default: `data/editions/sr5/sitemap.xml`)
- `--output`: Output directory for HTML files (default: `tmp/html_cache`)
- `--limit N`: Limit number of pages to download (for testing)
- `--min-delay SECONDS`: Minimum delay between requests (default: 3.0)
- `--max-delay SECONDS`: Maximum delay between requests (default: 7.0)
- `--check-robots`: Check and respect robots.txt
- `--verbose`: Enable verbose logging

**Anti-Detection Features:**
- Random delays between requests (3-7 seconds by default)
- Browser-like User-Agent rotation
- Complete browser headers (Accept, Accept-Language, etc.)
- Session management with cookie persistence
- Referer chaining to simulate navigation
- Exponential backoff on rate limit responses (429)
- Respect for robots.txt (optional)

### Phase 2: Convert HTML to Markdown

Convert downloaded HTML files to markdown:

```bash
# Convert first 5 downloaded HTML files (for testing)
python scripts/scrape/convert_to_markdown.py --limit 5

# Convert all downloaded HTML files
python scripts/scrape/convert_to_markdown.py

# Specify custom input/output directories
python scripts/scrape/convert_to_markdown.py --input tmp/html_cache --output docs/web_pages

# Verbose logging
python scripts/scrape/convert_to_markdown.py --verbose
```

**Options:**
- `--input`: Input directory with HTML files (default: `tmp/html_cache`)
- `--output`: Output directory for markdown files (default: `docs/web_pages`)
- `--limit N`: Limit number of files to process (for testing)
- `--base-url`: Base URL of the wiki (for link conversion)
- `--verbose`: Enable verbose logging

**Conversion Features:**
- Preserves tables (converted to markdown table syntax)
- Converts internal wiki links to markdown links
- Handles MediaWiki-specific elements (infoboxes, navigation)
- Removes navigation elements, edit links, talk pages
- Cleans and normalizes markdown output
- Uses `trafilatura` (preferred) or `markdownify` (fallback) for conversion

## Workflow Example

### Testing with Limited Pages

1. Download a few pages for testing:
```bash
python scripts/scrape/download_html.py --limit 5
```

2. Convert them to markdown:
```bash
python scripts/scrape/convert_to_markdown.py --limit 5
```

3. Review the output in `docs/web_pages/` to verify quality

4. Adjust conversion settings if needed, then process all pages:
```bash
python scripts/scrape/download_html.py
python scripts/scrape/convert_to_markdown.py
```

### Full Processing

1. Download all pages (this will take a while due to rate limiting):
```bash
python scripts/scrape/download_html.py
```

2. Convert all downloaded HTML to markdown:
```bash
python scripts/scrape/convert_to_markdown.py
```

## File Structure

```
scripts/scrape/
  ├── __init__.py
  ├── download_html.py      # Phase 1: Download HTML
  ├── convert_to_markdown.py # Phase 2: Convert to Markdown
  ├── requirements-scrape.txt # Python dependencies
  └── README.md             # This file

tmp/html_cache/            # Downloaded HTML files
docs/web_pages/            # Generated markdown files
```

## Rate Limiting and Anti-Detection

The download script implements several measures to avoid being blocked:

- **Mandatory Delays**: Random delays between ALL requests (default 3-7 seconds)
- **User-Agent Rotation**: Rotates through realistic browser User-Agents
- **Browser Headers**: Includes all standard browser request headers
- **Session Management**: Maintains persistent sessions with cookies
- **Referer Chaining**: Chains referrers to simulate navigation
- **Exponential Backoff**: Automatically backs off on 429 (Too Many Requests) responses
- **Robots.txt Support**: Optional respect for robots.txt directives

**Important**: The default delays (3-7 seconds) are conservative to avoid being blocked. If you need faster processing, you can reduce delays, but be aware this increases the risk of rate limiting.

## Troubleshooting

### Rate Limiting (429 Errors)

If you encounter 429 (Too Many Requests) errors:
- Increase `--min-delay` and `--max-delay` values
- The script will automatically retry with exponential backoff
- Consider processing in smaller batches

### Conversion Quality Issues

If markdown output quality is poor:
- Try installing `trafilatura` (preferred) instead of just `markdownify`
- Check that HTML files were downloaded correctly
- Review verbose logs to identify problematic pages

### Missing Dependencies

If you get import errors:
```bash
pip install -r scripts/scrape/requirements-scrape.txt
```

### Permission Errors

Make sure output directories are writable:
```bash
mkdir -p tmp/html_cache docs/web_pages
chmod -R u+w tmp/html_cache docs/web_pages
```

## Notes

- The scripts support resume capability - they skip already downloaded/converted files
- HTML files are cached in `tmp/html_cache/` for re-processing
- MediaWiki internal links are converted to markdown link format
- Page titles with colons (namespace pages) are converted to underscores in filenames
- The conversion process removes MediaWiki navigation and UI elements

## See Also

- [Main Scripts README](../README.md) - Overview of all project scripts
- [Project README](../../README.md) - Project overview

