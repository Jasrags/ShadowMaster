#!/usr/bin/env python3
"""
Convert downloaded HTML files to high-quality markdown.

This script processes HTML files from the cache directory and converts them
to well-structured markdown, preserving tables, links, and MediaWiki-specific
elements.
"""

import argparse
import logging
import re
from pathlib import Path
from typing import Tuple, Dict
from urllib.parse import urlparse, unquote

try:
    import trafilatura
    TRAFILATURA_AVAILABLE = True
except ImportError:
    TRAFILATURA_AVAILABLE = False
    logging.warning("trafilatura not available, falling back to markdownify")

try:
    from markdownify import markdownify as md
    MARKDOWNIFY_AVAILABLE = True
except ImportError:
    MARKDOWNIFY_AVAILABLE = False

from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def clean_mediawiki_content(soup: BeautifulSoup) -> BeautifulSoup:
    """Remove MediaWiki-specific navigation and UI elements."""
    # Remove navigation boxes and menus
    for nav in soup.find_all(['nav', 'div'], class_=re.compile(r'nav|navigation|sidebar|mw-navigation', re.I)):
        nav.decompose()
    
    # Remove edit links and talk page links
    for link in soup.find_all('a', href=re.compile(r'(edit|action=edit|Talk:|Special:)', re.I)):
        link.decompose()
    
    # Remove MediaWiki metadata and indicators
    for meta in soup.find_all(['div', 'span'], class_=re.compile(r'mw-indicators|metadata|catlinks|mw-editsection', re.I)):
        meta.decompose()
    
    # Remove jump links
    for jump in soup.find_all('a', class_=re.compile(r'jump|mw-jump', re.I)):
        jump.decompose()
    
    # Remove print/export links
    for print_link in soup.find_all('a', href=re.compile(r'printable|export|action=', re.I)):
        print_link.decompose()
    
    # Remove "Jump to" navigation sections
    for jump_section in soup.find_all(['div', 'span'], string=re.compile(r'Jump to:', re.I)):
        jump_section.parent.decompose() if jump_section.parent else jump_section.decompose()
    
    # Remove site subtitle
    for site_sub in soup.find_all(['div', 'span'], id=re.compile(r'siteSub|contentSub', re.I)):
        site_sub.decompose()
    
    # Remove navigation menu sections
    nav_headers = soup.find_all(['h2', 'h3'], string=re.compile(r'Navigation|Tools|Personal tools', re.I))
    for header in nav_headers:
        # Remove the header and its following siblings until next heading
        current = header
        while current and current.name not in ['h1', 'h2', 'h3'] or current == header:
            next_elem = current.next_sibling
            current.decompose()
            current = next_elem
            if current and current.name in ['h1', 'h2', 'h3'] and current != header:
                break
    
    return soup


def convert_internal_links(soup: BeautifulSoup, base_url: str) -> BeautifulSoup:
    """Convert MediaWiki internal links to markdown-friendly format."""
    from bs4 import NavigableString
    
    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        
        # Handle relative links
        if href.startswith('/'):
            # Convert to full URL if needed
            parsed_base = urlparse(base_url)
            href = f"{parsed_base.scheme}://{parsed_base.netloc}{href}"
        
        # Extract page title from MediaWiki URL
        if 'index.php/' in href:
            page_title = href.split('index.php/')[-1]
            # Remove query parameters and fragments
            page_title = page_title.split('?')[0].split('#')[0]
            # URL decode
            page_title = unquote(page_title)
            # Convert to markdown link format
            link_text = link.get_text(strip=True) or page_title
            # Escape brackets in link text
            link_text = link_text.replace('[', '\\[').replace(']', '\\]')
            # Create markdown link
            markdown_link = f"[{link_text}]({page_title.replace(':', '_')}.md)"
            link.replace_with(NavigableString(markdown_link))
        elif href.startswith('http'):
            # External link - keep as is but convert to markdown
            link_text = link.get_text(strip=True) or href
            # Escape brackets in link text
            link_text = link_text.replace('[', '\\[').replace(']', '\\]')
            markdown_link = f"[{link_text}]({href})"
            link.replace_with(NavigableString(markdown_link))
    
    return soup


def convert_single_table_to_markdown(table: BeautifulSoup) -> str:
    """Convert a single HTML table to markdown format."""
    markdown_table = []
    # Find all tr elements (they may be in tbody, thead, tfoot, or directly in table)
    rows = table.find_all('tr')
    
    if not rows:
        return None
    
    # Handle caption if present
    caption = table.find('caption')
    caption_text = ''
    if caption:
        caption_text = caption.get_text(strip=True)
        # Combine multiple captions (some tables have multiple caption elements)
        all_captions = table.find_all('caption')
        if len(all_captions) > 1:
            caption_text = ' / '.join([cap.get_text(strip=True) for cap in all_captions])
    
    # Track if we've added the header separator
    header_separator_added = False
    
    for i, row in enumerate(rows):
        # Get cells (td/th) - they should be direct children of tr
        cells = row.find_all(['td', 'th'], recursive=False)
        if not cells:
            continue
        
        cell_texts = []
        for cell in cells:
            # Get text, preserving inline elements but not converting links
            cell_soup = BeautifulSoup(str(cell), 'lxml')
            
            # Remove links but keep their text
            for link in cell_soup.find_all('a', href=True):
                link_text = link.get_text(strip=True)
                link.replace_with(link_text)
            
            # Handle other inline elements (bold, italic, etc.)
            for bold in cell_soup.find_all(['b', 'strong']):
                bold_text = bold.get_text(strip=True)
                bold.replace_with(f"**{bold_text}**")
            
            for italic in cell_soup.find_all(['i', 'em']):
                italic_text = italic.get_text(strip=True)
                italic.replace_with(f"*{italic_text}*")
            
            # Get the final text
            text = cell_soup.get_text(separator=' ', strip=True)
            # Escape pipe characters in cell content
            text = text.replace('|', '\\|')
            # Escape newlines and normalize whitespace
            text = text.replace('\n', ' ').replace('\r', ' ')
            text = ' '.join(text.split())  # Normalize whitespace
            cell_texts.append(text)
        
        if cell_texts:
            markdown_row = '| ' + ' | '.join(cell_texts) + ' |'
            markdown_table.append(markdown_row)
            
            # Add separator after header row (first row with th elements)
            if not header_separator_added and any(cell.name == 'th' for cell in cells):
                separator = '| ' + ' | '.join(['---'] * len(cells)) + ' |'
                markdown_table.append(separator)
                header_separator_added = True
    
    if not markdown_table:
        return None
    
    table_md = '\n'.join(markdown_table)
    
    # Add caption as bold header above the table
    if caption_text:
        # Clean up caption text (remove extra whitespace, normalize)
        caption_text = ' '.join(caption_text.split())
        table_md = f"**{caption_text}**\n{table_md}"
    
    return table_md


def convert_tables_to_markdown(soup: BeautifulSoup) -> Tuple[BeautifulSoup, Dict[str, str]]:
    """Convert HTML tables to markdown table format.
    
    Handles two patterns:
    1. Standard MediaWiki tables (class="wikitable" or "sortable wikitable")
    2. Nested tables where outer table is a layout container (no class, contains tables in cells)
    
    Returns:
        tuple: (modified soup, dict of placeholders to markdown table strings)
    """
    from bs4 import NavigableString, Tag
    
    table_placeholders = {}
    placeholder_counter = 0
    
    # Process tables from innermost to outermost to handle nested patterns
    # Find all tables and sort by depth (deeper first)
    all_tables = soup.find_all('table')
    if not all_tables:
        return soup, table_placeholders
    
    # Calculate depth for each table (how many table ancestors it has)
    table_depths = []
    for table in all_tables:
        depth = 0
        parent = table.parent
        while parent:
            if parent.name == 'table':
                depth += 1
            parent = parent.parent
        table_depths.append((depth, table))
    
    # Sort by depth descending (innermost first)
    table_depths.sort(key=lambda x: x[0], reverse=True)
    
    for depth, table in table_depths:
        # Check if this table is a layout container (no class, contains only tables in cells)
        table_classes = table.get('class', [])
        has_wikitable_class = any('wikitable' in str(cls).lower() for cls in table_classes)
        
        # Check if table cells contain only tables (layout pattern)
        is_layout_container = False
        if not has_wikitable_class:
            rows = table.find_all('tr')  # Find rows at any level (may be in tbody)
            if rows:
                # Check if all cells contain only tables (or are empty)
                all_cells_contain_tables = True
                for row in rows:
                    cells = row.find_all(['td', 'th'], recursive=False)  # Cells should be direct children of tr
                    if not cells:
                        continue
                    for cell in cells:
                        # Check if cell contains only tables (and maybe whitespace)
                        # Look for tables that are direct children of the cell
                        cell_tables = cell.find_all('table', recursive=False)
                        # Check for other non-whitespace content
                        other_content = []
                        for child in cell.children:
                            if hasattr(child, 'name'):
                                if child.name != 'table' and str(child).strip():
                                    other_content.append(child)
                            elif str(child).strip() and str(child).strip() not in ['\n', '\r', ' ']:
                                other_content.append(child)
                        
                        if cell_tables and not other_content:
                            continue  # This cell only has tables
                        elif not cell_tables:
                            all_cells_contain_tables = False
                            break
                    if not all_cells_contain_tables:
                        break
                is_layout_container = all_cells_contain_tables and len(rows) > 0
        
        if is_layout_container:
            # This is a layout container - extract inner tables separately
            # Create placeholders for each inner table, preserving the cell structure
            rows = table.find_all('tr', recursive=False)
            
            if rows:
                # Create a new table to replace the layout container
                new_table = soup.new_tag('table')
                tbody = soup.new_tag('tbody')
                
                for row in rows:
                    new_tr = soup.new_tag('tr')
                    cells = row.find_all(['td', 'th'], recursive=False)
                    
                    for cell in cells:
                        # Find tables in this cell
                        inner_tables = cell.find_all('table', recursive=False)
                        new_td = soup.new_tag('td')
                        
                        if inner_tables:
                            # Create a placeholder for each inner table
                            for inner_table in inner_tables:
                                inner_md = convert_single_table_to_markdown(inner_table)
                                if inner_md:
                                    placeholder = f"__TABLE_PLACEHOLDER_{placeholder_counter}__"
                                    table_placeholders[placeholder] = inner_md
                                    placeholder_counter += 1
                                    # Add placeholder to cell (with space separator if multiple)
                                    if new_td.string:
                                        new_td.string += ' ' + placeholder
                                    else:
                                        new_td.string = placeholder
                        else:
                            # Empty cell
                            new_td.string = ''
                        
                        new_tr.append(new_td)
                    tbody.append(new_tr)
                
                new_table.append(tbody)
                table.replace_with(new_table)
            else:
                table.decompose()
        else:
            # Standard table - convert directly
            table_md = convert_single_table_to_markdown(table)
            if table_md:
                placeholder = f"__TABLE_PLACEHOLDER_{placeholder_counter}__"
                table_placeholders[placeholder] = table_md
                placeholder_counter += 1
                # Replace with a <pre> tag containing the placeholder
                pre_tag = soup.new_tag('pre')
                pre_tag.string = placeholder
                table.replace_with(pre_tag)
            else:
                table.decompose()
    
    return soup, table_placeholders


def convert_infoboxes(soup: BeautifulSoup) -> BeautifulSoup:
    """Convert MediaWiki infoboxes to markdown tables."""
    from bs4 import NavigableString
    
    for infobox in soup.find_all(['div', 'table'], class_=re.compile(r'infobox', re.I)):
        # Try to convert infobox to a table structure
        rows = []
        for row in infobox.find_all(['tr', 'div'], recursive=True):
            label = row.find(['th', 'td', 'span'], class_=re.compile(r'label|title', re.I))
            value = row.find(['td', 'span'], class_=re.compile(r'value|data', re.I))
            
            if label and value:
                label_text = label.get_text(strip=True).replace('|', '\\|')
                value_text = value.get_text(separator=' ', strip=True).replace('|', '\\|')
                rows.append(f"| {label_text} | {value_text} |")
        
        if rows:
            markdown_table = '\n'.join(['| Property | Value |', '| --- | --- |'] + rows)
            infobox.replace_with(NavigableString(f'\n{markdown_table}\n'))
        else:
            infobox.decompose()
    
    return soup


def html_to_markdown(html_content: str, base_url: str = '') -> str:
    """Convert HTML to markdown with MediaWiki-specific handling."""
    # Parse HTML
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Extract main content area first (MediaWiki uses #mw-content-text)
    content_div = soup.find('div', id='mw-content-text')
    if content_div:
        # Work with just the content area
        soup = BeautifulSoup(str(content_div), 'lxml')
    else:
        # Fallback to #content or body
        content_div = soup.find('div', id='content') or soup.find('body')
        if content_div:
            soup = BeautifulSoup(str(content_div), 'lxml')
    
    # Clean MediaWiki-specific elements
    soup = clean_mediawiki_content(soup)
    
    # Convert infoboxes
    soup = convert_infoboxes(soup)
    
    # Convert tables (returns soup and placeholders dict)
    soup, table_placeholders = convert_tables_to_markdown(soup)
    
    # Convert to markdown using trafilatura or markdownify
    html_str = str(soup)
    
    if TRAFILATURA_AVAILABLE:
        try:
            # Trafilatura is better at extracting main content
            # But since we've already extracted the content div, pass the cleaned HTML
            markdown = trafilatura.extract(html_str, output_format='markdown')
            if markdown and len(markdown.strip()) > 50:  # Ensure we got substantial content
                # Replace placeholders with actual table markdown
                for placeholder, table_md in table_placeholders.items():
                    markdown = markdown.replace(placeholder, table_md)
                return markdown
        except Exception as e:
            logger.warning(f"trafilatura conversion failed: {e}, falling back to markdownify")
    
    if MARKDOWNIFY_AVAILABLE:
        # Use markdownify with custom options
        markdown = md(
            html_str,
            heading_style="ATX",  # Use # for headings
            bullets="-",  # Use - for lists
            strip=['script', 'style'],  # Remove script and style tags
        )
        # Replace placeholders with actual table markdown
        # markdownify converts <pre> tags to code blocks (```) and layout tables to markdown tables
        import re
        
        # Debug: log placeholders
        if table_placeholders:
            logger.debug(f"Replacing {len(table_placeholders)} placeholders: {list(table_placeholders.keys())}")
            # Also check if placeholders are in the markdown
            placeholder_in_markdown = [p for p in table_placeholders.keys() if p in markdown]
            if placeholder_in_markdown:
                logger.debug(f"Found {len(placeholder_in_markdown)} placeholders in markdown: {placeholder_in_markdown}")
            else:
                logger.warning(f"No placeholders found in markdown! Available: {list(table_placeholders.keys())[:3]}")
        else:
            logger.warning("No table placeholders to replace!")
        
        # First, handle table rows that contain placeholders (from layout containers)
        # These appear as: | __TABLE_PLACEHOLDER_0__ | __TABLE_PLACEHOLDER_1__ |
        # Note: markdownify escapes underscores, so we need to look for both escaped and unescaped versions
        if table_placeholders:
            # Check if any placeholders are actually in the markdown
            has_placeholders_in_markdown = any(p in markdown for p in table_placeholders.keys())
            if not has_placeholders_in_markdown:
                # Check for escaped versions
                has_escaped = any(p.replace('_', '\\_') in markdown for p in table_placeholders.keys())
                if not has_escaped:
                    logger.warning(f"Placeholders created but not found in markdown. Placeholders: {list(table_placeholders.keys())[:3]}")
            
            lines = markdown.split('\n')
            new_lines = []
            i = 0
            replaced_count = 0
            while i < len(lines):
                line = lines[i]
                line_stripped = line.strip()
                # Check if this is a table row containing placeholders
                # Markdownify may escape underscores, so check for both patterns
                found_placeholders = []
                for placeholder in table_placeholders.keys():
                    # Check for unescaped version
                    if placeholder in line:
                        found_placeholders.append(placeholder)
                    # Check for escaped version (underscores escaped as \_)
                    # Markdownify produces: \_\_TABLE\_PLACEHOLDER\_0\_\_
                    escaped_placeholder = placeholder.replace('_', '\\_')
                    if escaped_placeholder in line:
                        if placeholder not in found_placeholders:
                            found_placeholders.append(placeholder)
                    # Also check with regex in case format is slightly different
                    escaped_pattern = placeholder.replace('_', r'\\_')
                    if re.search(escaped_pattern, line):
                        if placeholder not in found_placeholders:
                            found_placeholders.append(placeholder)
                
                if line_stripped.startswith('|') and found_placeholders:
                    # Combine the tables for all found placeholders
                    combined_tables = []
                    for placeholder in found_placeholders:
                        if placeholder in table_placeholders:
                            combined_tables.append(table_placeholders[placeholder])
                    if combined_tables:
                        # Replace the line with the combined tables
                        new_lines.extend([''] + combined_tables + [''])
                        replaced_count += 1
                        logger.info(f"Replaced line {i} containing {found_placeholders}")
                        i += 1
                        continue
                elif line_stripped.startswith('|') and 'TABLE_PLACEHOLDER' in line:
                    # Found a line with TABLE_PLACEHOLDER - try to extract and replace manually
                    # Extract all placeholder names from the line
                    import re
                    placeholder_pattern = r'__TABLE_PLACEHOLDER_\d+__'
                    found_in_line = re.findall(placeholder_pattern, line)
                    if found_in_line:
                        # Try to replace with the actual tables
                        combined_tables = []
                        for ph in found_in_line:
                            if ph in table_placeholders:
                                combined_tables.append(table_placeholders[ph])
                        if combined_tables:
                            new_lines.extend([''] + combined_tables + [''])
                            replaced_count += 1
                            logger.info(f"Manually replaced line {i} containing {found_in_line}")
                            i += 1
                            continue
                    logger.warning(f"Line {i} has TABLE_PLACEHOLDER but couldn't replace: {repr(line[:100])}")
                    logger.warning(f"  Available placeholders: {list(table_placeholders.keys())[:5]}")
                new_lines.append(line)
                i += 1
            if replaced_count > 0:
                logger.info(f"Replaced {replaced_count} table rows containing placeholders")
            markdown = '\n'.join(new_lines)
        
        # Then replace any remaining placeholders in code blocks or plain text
        # Also handle table rows that might have been missed
        for placeholder, table_md in sorted(table_placeholders.items(), key=lambda x: int(re.search(r'\d+', x[0]).group()) if re.search(r'\d+', x[0]) else 0, reverse=True):
            if placeholder not in markdown:
                continue  # Already replaced
            
            # Try to replace in table rows first (most common case)
            # Pattern: | placeholder | or | placeholder | other |
            table_row_pattern = f"\\|\\s*{re.escape(placeholder)}\\s*\\|"
            if re.search(table_row_pattern, markdown):
                # Find the full line and replace it
                lines = markdown.split('\n')
                new_lines = []
                for line in lines:
                    if placeholder in line and line.strip().startswith('|'):
                        # This is a table row with the placeholder - replace the whole line
                        # Check if there are other placeholders in the same line
                        other_placeholders = [p for p in table_placeholders.keys() if p != placeholder and p in line]
                        if other_placeholders:
                            # Multiple placeholders - combine them
                            combined = [table_md]
                            for other_ph in other_placeholders:
                                if other_ph in table_placeholders:
                                    combined.append(table_placeholders[other_ph])
                            new_lines.extend([''] + combined + [''])
                        else:
                            # Single placeholder - just replace with its table
                            new_lines.extend([''] + [table_md] + [''])
                    else:
                        new_lines.append(line)
                markdown = '\n'.join(new_lines)
                continue
            
            # Try code block format: ```\nplaceholder\n```
            escaped_placeholder = re.escape(placeholder)
            code_block_pattern = f"```\\s*\\n{escaped_placeholder}\\s*\\n```"
            if re.search(code_block_pattern, markdown):
                markdown = re.sub(code_block_pattern, table_md, markdown)
            # Also try plain text replacement
            elif placeholder in markdown:
                markdown = markdown.replace(placeholder, table_md)
        return markdown
    
    # Fallback: basic conversion
    logger.warning("No markdown conversion library available, using basic text extraction")
    markdown = soup.get_text(separator='\n\n', strip=True)
    # Replace placeholders
    for placeholder, table_md in table_placeholders.items():
        markdown = markdown.replace(placeholder, table_md)
    return markdown


def clean_markdown(markdown: str) -> str:
    """Clean and normalize markdown output."""
    # Remove blank lines between table rows (table rows should be consecutive)
    # Process line by line to identify table blocks and remove internal blank lines
    lines = markdown.split('\n')
    cleaned_lines = []
    in_table = False
    
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        is_table_row = line_stripped.startswith('|') and '|' in line_stripped[1:]
        
        if is_table_row:
            if not in_table:
                # Starting a new table - add blank line before if previous line wasn't empty
                if cleaned_lines and cleaned_lines[-1].strip():
                    cleaned_lines.append('')
                in_table = True
            # Add the table row (no blank line before it if we're already in a table)
            cleaned_lines.append(line)
        else:
            if in_table:
                # Ending a table - add blank line after if this line isn't empty
                if line_stripped:  # Non-empty line after table
                    cleaned_lines.append('')
                in_table = False
            cleaned_lines.append(line)
    
    markdown = '\n'.join(cleaned_lines)
    
    # Remove excessive blank lines (3+ becomes 2)
    markdown = re.sub(r'\n{3,}', '\n\n', markdown)
    
    # Fix spacing around headings
    markdown = re.sub(r'\n+(\#{1,6}\s)', r'\n\n\1', markdown)
    
    # Fix spacing around lists
    markdown = re.sub(r'\n+([-*+]\s)', r'\n\n\1', markdown)
    markdown = re.sub(r'\n+(\d+\.\s)', r'\n\n\1', markdown)
    
    # Remove leading/trailing whitespace
    markdown = markdown.strip()
    
    return markdown


def get_markdown_filename(html_filename: str) -> str:
    """Convert HTML filename to markdown filename."""
    # Remove .html extension
    base = html_filename.replace('.html', '')
    # Replace colons with underscores for MediaWiki namespace pages
    base = base.replace(':', '_')
    return f"{base}.md"


def convert_file(html_path: Path, output_dir: Path, base_url: str = '') -> bool:
    """Convert a single HTML file to markdown."""
    try:
        # Read HTML
        html_content = html_path.read_text(encoding='utf-8')
        
        # Extract base URL from HTML if not provided
        if not base_url:
            soup = BeautifulSoup(html_content, 'lxml')
            base_link = soup.find('link', rel='canonical') or soup.find('base', href=True)
            if base_link:
                base_url = base_link.get('href', '')
        
        # Convert to markdown
        markdown = html_to_markdown(html_content, base_url)
        
        # Final pass: replace any remaining placeholders in table rows
        # This is a safety net in case the earlier replacement didn't work
        import re
        placeholder_pattern = r'__TABLE_PLACEHOLDER_\d+__'
        placeholders_in_markdown = list(set(re.findall(placeholder_pattern, markdown)))
        if placeholders_in_markdown:
            # We need to get the placeholders from the conversion
            # Re-run just the table conversion part to get placeholders
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'lxml')
            content_div = soup.find('div', id='mw-content-text')
            if content_div:
                soup = BeautifulSoup(str(content_div), 'lxml')
            else:
                content_div = soup.find('div', id='content') or soup.find('body')
                if content_div:
                    soup = BeautifulSoup(str(content_div), 'lxml')
            soup = clean_mediawiki_content(soup)
            _, table_placeholders = convert_tables_to_markdown(soup)
            
            # Now replace any placeholders found in the markdown
            # Process lines that contain placeholders
            lines = markdown.split('\n')
            new_lines = []
            i = 0
            while i < len(lines):
                line = lines[i]
                if any(ph in line for ph in placeholders_in_markdown) and line.strip().startswith('|'):
                    # Extract all placeholders from this line
                    ph_in_line = re.findall(placeholder_pattern, line)
                    if ph_in_line:
                        # Get tables for all placeholders in this line
                        combined_tables = []
                        for ph in ph_in_line:
                            if ph in table_placeholders:
                                combined_tables.append(table_placeholders[ph])
                        if combined_tables:
                            new_lines.extend([''] + combined_tables + [''])
                            i += 1
                            continue
                new_lines.append(line)
                i += 1
            markdown = '\n'.join(new_lines)
            
            # Also do simple replacements for any remaining placeholders
            for placeholder in placeholders_in_markdown:
                if placeholder in markdown and placeholder in table_placeholders:
                    markdown = markdown.replace(placeholder, table_placeholders[placeholder])
        
        # Clean markdown
        markdown = clean_markdown(markdown)
        
        # Generate output filename
        md_filename = get_markdown_filename(html_path.name)
        output_path = output_dir / md_filename
        
        # Write markdown
        output_path.write_text(markdown, encoding='utf-8')
        logger.info(f"Converted {html_path.name} -> {md_filename}")
        return True
        
    except Exception as e:
        logger.error(f"Error converting {html_path}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Convert downloaded HTML files to markdown'
    )
    parser.add_argument(
        '--input',
        default='tmp/html_cache',
        help='Input directory with HTML files'
    )
    parser.add_argument(
        '--output',
        default='docs/web_pages',
        help='Output directory for markdown files'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Limit number of files to process (for testing)'
    )
    parser.add_argument(
        '--base-url',
        default='http://adragon202.no-ip.org/Shadowrun',
        help='Base URL of the wiki (for link conversion)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Check for conversion libraries
    if not TRAFILATURA_AVAILABLE and not MARKDOWNIFY_AVAILABLE:
        logger.error("No markdown conversion library available!")
        logger.error("Please install trafilatura or markdownify:")
        logger.error("  pip install trafilatura")
        logger.error("  or")
        logger.error("  pip install markdownify")
        return 1
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Output directory: {output_dir.absolute()}")
    
    # Find HTML files
    input_dir = Path(args.input)
    if not input_dir.exists():
        logger.error(f"Input directory not found: {input_dir}")
        return 1
    
    html_files = sorted(input_dir.glob('*.html'))
    
    if not html_files:
        logger.warning(f"No HTML files found in {input_dir}")
        return 1
    
    # Apply limit if specified
    if args.limit:
        html_files = html_files[:args.limit]
        logger.info(f"Limited to first {args.limit} files for testing")
    
    logger.info(f"Found {len(html_files)} HTML files to convert")
    
    # Convert files
    successful = 0
    failed = 0
    skipped = 0
    
    for html_file in html_files:
        md_filename = get_markdown_filename(html_file.name)
        output_path = output_dir / md_filename
        
        if output_path.exists():
            skipped += 1
            logger.debug(f"Skipping already converted: {md_filename}")
            continue
        
        if convert_file(html_file, output_dir, args.base_url):
            successful += 1
        else:
            failed += 1
    
    logger.info(f"\nConversion complete:")
    logger.info(f"  Successful: {successful}")
    logger.info(f"  Failed: {failed}")
    logger.info(f"  Skipped: {skipped}")
    logger.info(f"  Total: {len(html_files)}")
    
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    exit(main())

