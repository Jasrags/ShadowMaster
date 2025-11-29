<!-- 94075bec-5eb0-4e91-9a0e-eeb9461c701c 224dc859-9247-4b6f-9689-c9e37cf4efcb -->
# Web Scraping and Markdown Conversion System

## Overview

Build a Python-based two-phase system to ingest Shadowrun wiki pages from the sitemap, download HTML files, and convert them to well-structured markdown.

## Architecture

### Phase 1: HTML Download

- Parse `data/editions/sr5/sitemap.xml` to extract URLs
- **CRITICAL: Anti-Detection and Rate Limiting** - Download HTML pages with sophisticated measures to avoid being blocked:
  - **Mandatory rate limiting**: Random delays between ALL requests (configurable, default 3-7 seconds, with jitter)
  - **Realistic browser User-Agent headers**: Rotate through common browser User-Agents (Chrome, Firefox, Safari on various OS versions)
  - **Session management**: Maintain persistent sessions with cookies to mimic real browser behavior
  - **Complete browser headers**: Include all standard browser request headers:
    - Accept (with proper content types)
    - Accept-Language (realistic language preferences)
    - Accept-Encoding (gzip, deflate, br)
    - Referer (chain referrers to simulate navigation)
    - Connection: keep-alive
    - DNT (Do Not Track) header
  - **Request spacing**: Never make concurrent requests; always wait between fetches
  - **Exponential backoff**: On 429 (Too Many Requests) or 503 responses, implement exponential backoff with retry
  - **Respect robots.txt**: Check and honor robots.txt directives (optional, configurable)
  - **Randomize request patterns**: Add small random variations to delay timing to avoid predictable patterns
  - **IP rotation consideration**: Document potential need for proxy rotation if blocks occur (future enhancement)
- Save HTML files to `tmp/html_cache/` with organized structure
- Support `--limit N` flag for testing with limited pages
- Resume capability (skip already downloaded files)
- Configurable delay ranges via command-line flags (`--min-delay`, `--max-delay`)

### Phase 2: HTML to Markdown Conversion

- Read HTML files from cache
- Convert to high-quality markdown preserving:
  - Tables (using markdown table syntax)
  - Links (convert to markdown links, preserve internal wiki links)
  - Headings hierarchy
  - Lists (ordered and unordered)
  - Code blocks
  - Images (as markdown image references)
  - MediaWiki-specific elements (infoboxes, navigation boxes)
- Clean up and normalize markdown
- Save to `docs/web_pages/` with appropriate filenames

## Implementation Details

### Files to Create

1. **`scripts/scrape/download_html.py`**

   - Parse sitemap.xml using `xml.etree.ElementTree`
   - Download HTML with `requests` library
   - **Implement robust rate limiting and anti-detection**:
     - Enforce mandatory delays between ALL requests (no concurrent downloads)
     - Rotate User-Agent strings from a pool of realistic browser agents
     - Build complete browser-like request headers for each request
     - Implement session persistence with cookie handling
     - Add random jitter to delay timing (avoid fixed intervals)
     - Handle rate limit responses (429) with exponential backoff
     - Log request timing and delays for monitoring
   - Save HTML with URL-based filenames
   - Progress tracking and error logging

2. **`scripts/scrape/convert_to_markdown.py`**

   - Use `trafilatura` or `markdownify` for core conversion
   - Use `beautifulsoup4` for MediaWiki-specific parsing
   - Handle tables, infoboxes, navigation boxes
   - Clean and normalize markdown output
   - Generate appropriate filenames from page titles

3. **`scripts/scrape/__init__.py`** (empty, for package structure)

4. **`requirements-scrape.txt`** (or update existing requirements)

   - `requests>=2.31.0`
   - `beautifulsoup4>=4.12.0`
   - `trafilatura>=1.6.0` (or `markdownify>=0.11.6`)
   - `lxml>=4.9.0` (for better HTML parsing)

5. **`scripts/scrape/README.md`**

   - Usage instructions
   - Examples for testing with limited pages

### Key Features

- **Anti-Detection & Rate Limiting**: 
  - Mandatory delays between all requests (default 3-7 seconds with randomization)
  - Browser-like headers and User-Agent rotation
  - Session management to maintain state
  - Exponential backoff on rate limit responses
  - Configurable delay ranges to adjust crawling speed
- **Testing Support**: `--limit N` flag to process only first N pages
- **Resume Capability**: Skip already downloaded/processed files
- **Error Handling**: Log failures, continue processing, retry with backoff
- **Progress Tracking**: Show progress bars or status updates with timing information
- **Filename Generation**: Convert MediaWiki page titles to safe filenames
- **Link Preservation**: Convert internal wiki links to markdown links (may need URL transformation)

### MediaWiki-Specific Handling

- Parse MediaWiki page structure (content area, navigation, etc.)
- Handle MediaWiki tables (convert to markdown tables)
- Preserve internal links (SR5:Character_Creation → appropriate markdown link)
- Handle infoboxes and sidebars (convert to markdown tables or structured blocks)
- Remove navigation elements, edit links, talk pages

### Usage Examples

```bash
# Download first 5 pages for testing (with default 3-7 second delays)
python scripts/scrape/download_html.py --limit 5

# Download all pages with default rate limiting
python scripts/scrape/download_html.py

# Download with custom delay range (slower, more conservative)
python scripts/scrape/download_html.py --min-delay 5 --max-delay 10

# Download with faster delays (use with caution, may trigger rate limits)
python scripts/scrape/download_html.py --min-delay 1 --max-delay 3

# Convert downloaded HTML to markdown (first 5)
python scripts/scrape/convert_to_markdown.py --limit 5

# Convert all downloaded HTML
python scripts/scrape/convert_to_markdown.py
```

## File Structure

```
scripts/scrape/
  ├── __init__.py
  ├── download_html.py
  ├── convert_to_markdown.py
  └── README.md

tmp/
  └── html_cache/
      └── [organized HTML files]

docs/web_pages/
  └── [generated .md files]
```

## Dependencies

Add to project requirements or create `requirements-scrape.txt`:

- `requests` - HTTP downloading
- `beautifulsoup4` - HTML parsing
- `trafilatura` or `markdownify` - HTML to markdown conversion
- `lxml` - Fast XML/HTML parser
- `tqdm` (optional) - Progress bars

## Testing Strategy

1. Start with `--limit 5` to test download and conversion
2. Verify markdown quality on sample pages
3. Check link preservation and table formatting
4. Iterate on conversion quality before full run
5. Process full sitemap once quality is acceptable

### To-dos

- [ ] Create sitemap parser to extract URLs from data/editions/sr5/sitemap.xml
- [ ] Implement download_html.py with **robust rate limiting and anti-detection measures**:
- [ ] Implement convert_to_markdown.py using advanced libraries (trafilatura/markdownify) with MediaWiki-specific handling
- [ ] Create requirements file and document dependencies
- [ ] Create README.md with usage instructions, examples, and rate limiting guidelines