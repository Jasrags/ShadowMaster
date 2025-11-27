#!/usr/bin/env python3
"""
Download HTML pages from Shadowrun wiki sitemap with anti-detection measures.

This script implements sophisticated rate limiting and browser-like behavior
to avoid being blocked while crawling the wiki.
"""

import argparse
import logging
import os
import random
import time
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse, urlunparse
from urllib.robotparser import RobotFileParser

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Realistic browser User-Agents to rotate through
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
]


def get_browser_headers(user_agent: str, referer: str = None) -> dict:
    """Generate realistic browser headers."""
    headers = {
        'User-Agent': user_agent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none' if referer is None else 'same-origin',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
    }
    if referer:
        headers['Referer'] = referer
    return headers


def parse_sitemap(sitemap_path: str) -> list:
    """Parse sitemap.xml and extract URLs."""
    logger.info(f"Parsing sitemap from {sitemap_path}")
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    
    # Handle namespace
    ns = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = []
    for url_elem in root.findall('sitemap:url', ns):
        loc_elem = url_elem.find('sitemap:loc', ns)
        if loc_elem is not None:
            url = loc_elem.text.strip()
            # Skip talk pages and other non-content pages
            if 'Talk:' not in url and 'index.php' in url:
                urls.append(url)
    
    logger.info(f"Found {len(urls)} URLs in sitemap")
    return urls


def get_filename_from_url(url: str) -> str:
    """Convert URL to a safe filename."""
    parsed = urlparse(url)
    # Extract page name from MediaWiki URL
    if 'index.php/' in parsed.path:
        page_name = parsed.path.split('index.php/')[-1]
    else:
        page_name = parsed.path.split('/')[-1] or 'index'
    
    # URL decode and sanitize
    page_name = page_name.replace('%3A', ':').replace('%2F', '_')
    # Replace problematic characters
    safe_name = "".join(c if c.isalnum() or c in ('-', '_', ':') else '_' for c in page_name)
    return f"{safe_name}.html"


def check_robots_txt(base_url: str) -> RobotFileParser:
    """Check and parse robots.txt if available."""
    try:
        robots_url = f"{base_url}/robots.txt"
        rp = RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        logger.info(f"Loaded robots.txt from {robots_url}")
        return rp
    except Exception as e:
        logger.warning(f"Could not load robots.txt: {e}")
        return None


def download_page(
    url: str,
    output_dir: Path,
    session: requests.Session,
    user_agent: str,
    referer: str = None,
    robots_parser: RobotFileParser = None,
    min_delay: float = 3.0,
    max_delay: float = 7.0,
) -> bool:
    """Download a single page with anti-detection measures."""
    # Check robots.txt if available
    if robots_parser:
        parsed_url = urlparse(url)
        if not robots_parser.can_fetch(user_agent, url):
            logger.warning(f"Skipping {url} - disallowed by robots.txt")
            return False
    
    filename = get_filename_from_url(url)
    output_path = output_dir / filename
    
    # Skip if already downloaded
    if output_path.exists():
        logger.debug(f"Skipping {url} - already downloaded")
        return True
    
    # Random delay before request (with jitter)
    delay = random.uniform(min_delay, max_delay)
    logger.info(f"Waiting {delay:.2f}s before fetching {url}")
    time.sleep(delay)
    
    # Make request with browser-like headers
    headers = get_browser_headers(user_agent, referer)
    
    try:
        response = session.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Save HTML
        output_path.write_text(response.text, encoding='utf-8')
        logger.info(f"Downloaded {url} -> {filename}")
        return True
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            # Rate limited - exponential backoff
            backoff_time = random.uniform(30, 60)
            logger.warning(f"Rate limited (429) for {url}. Waiting {backoff_time:.2f}s before retry...")
            time.sleep(backoff_time)
            # Retry once
            try:
                response = session.get(url, headers=headers, timeout=30)
                response.raise_for_status()
                output_path.write_text(response.text, encoding='utf-8')
                logger.info(f"Downloaded {url} after retry -> {filename}")
                return True
            except Exception as retry_e:
                logger.error(f"Retry failed for {url}: {retry_e}")
                return False
        elif e.response.status_code == 503:
            # Service unavailable - wait and retry
            backoff_time = random.uniform(15, 30)
            logger.warning(f"Service unavailable (503) for {url}. Waiting {backoff_time:.2f}s...")
            time.sleep(backoff_time)
            return False  # Don't retry automatically, will be retried on next run
        else:
            logger.error(f"HTTP error {e.response.status_code} for {url}: {e}")
            return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error for {url}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error for {url}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Download HTML pages from Shadowrun wiki sitemap'
    )
    parser.add_argument(
        '--sitemap',
        default='data/editions/sr5/sitemap.xml',
        help='Path to sitemap.xml file'
    )
    parser.add_argument(
        '--output',
        default='tmp/html_cache',
        help='Output directory for HTML files'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Limit number of pages to download (for testing)'
    )
    parser.add_argument(
        '--min-delay',
        type=float,
        default=3.0,
        help='Minimum delay between requests in seconds (default: 3.0)'
    )
    parser.add_argument(
        '--max-delay',
        type=float,
        default=7.0,
        help='Maximum delay between requests in seconds (default: 7.0)'
    )
    parser.add_argument(
        '--check-robots',
        action='store_true',
        help='Check and respect robots.txt'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Validate delay range
    if args.min_delay < 0 or args.max_delay < args.min_delay:
        logger.error("Invalid delay range: min_delay must be >= 0 and max_delay must be >= min_delay")
        return 1
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Output directory: {output_dir.absolute()}")
    
    # Parse sitemap
    sitemap_path = Path(args.sitemap)
    if not sitemap_path.exists():
        logger.error(f"Sitemap not found: {sitemap_path}")
        return 1
    
    urls = parse_sitemap(str(sitemap_path))
    
    # Apply limit if specified
    if args.limit:
        urls = urls[:args.limit]
        logger.info(f"Limited to first {args.limit} URLs for testing")
    
    # Setup session with retry strategy
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    # Check robots.txt if requested
    robots_parser = None
    if args.check_robots and urls:
        base_url = f"{urlparse(urls[0]).scheme}://{urlparse(urls[0]).netloc}"
        robots_parser = check_robots_txt(base_url)
    
    # Rotate User-Agent
    user_agent = random.choice(USER_AGENTS)
    logger.info(f"Using User-Agent: {user_agent[:50]}...")
    
    # Download pages
    successful = 0
    failed = 0
    skipped = 0
    
    for i, url in enumerate(urls, 1):
        logger.info(f"Processing {i}/{len(urls)}: {url}")
        
        # Use previous URL as referer (chain navigation)
        referer = urls[i - 2] if i > 1 else None
        
        # Rotate User-Agent occasionally (every 10-20 requests)
        if i % random.randint(10, 20) == 0:
            user_agent = random.choice(USER_AGENTS)
            logger.debug(f"Rotated User-Agent: {user_agent[:50]}...")
        
        filename = get_filename_from_url(url)
        if (output_dir / filename).exists():
            skipped += 1
            logger.debug(f"Skipping already downloaded: {filename}")
            continue
        
        if download_page(
            url,
            output_dir,
            session,
            user_agent,
            referer,
            robots_parser,
            args.min_delay,
            args.max_delay,
        ):
            successful += 1
        else:
            failed += 1
    
    logger.info(f"\nDownload complete:")
    logger.info(f"  Successful: {successful}")
    logger.info(f"  Failed: {failed}")
    logger.info(f"  Skipped: {skipped}")
    logger.info(f"  Total: {len(urls)}")
    
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    exit(main())

