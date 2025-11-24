#!/usr/bin/env python3
"""Remove duplicate comments from Go struct files"""

import re
import sys
import os

def remove_duplicate_comments(content: str) -> str:
    """Remove duplicate comment blocks"""
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this is a comment line
        if line.strip().startswith('//') and not line.strip().startswith('// '):
            # Check if next few lines are also comments
            comment_block = [line]
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('//'):
                comment_block.append(lines[j])
                j += 1
            
            # Check if the next comment block is identical
            if j < len(lines):
                next_line = lines[j]
                # Skip field line
                if next_line.strip() and not next_line.strip().startswith('//') and not next_line.strip().startswith('type ') and not next_line.strip() == '}':
                    k = j + 1
                    next_comment_block = []
                    while k < len(lines) and lines[k].strip().startswith('//'):
                        next_comment_block.append(lines[k])
                        k += 1
                    
                    # If blocks are identical, skip the second one
                    if comment_block == next_comment_block:
                        new_lines.extend(comment_block)
                        new_lines.append(next_line)
                        i = j + 1
                        continue
            
            new_lines.extend(comment_block)
            i = j
        else:
            new_lines.append(line)
            i += 1
    
    return '\n'.join(new_lines)

def cleanup_file(file_path: str) -> bool:
    """Clean up duplicate comments in a file"""
    if not os.path.exists(file_path):
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple approach: remove consecutive duplicate comment blocks
    lines = content.split('\n')
    new_lines = []
    prev_comment_block = None
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        if line.strip().startswith('//'):
            # Collect comment block
            comment_block = [line]
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('//'):
                comment_block.append(lines[j])
                j += 1
            
            # Check if this is a duplicate of previous
            if prev_comment_block == comment_block:
                # Skip this duplicate
                i = j
                continue
            
            prev_comment_block = comment_block
            new_lines.extend(comment_block)
            i = j
        else:
            prev_comment_block = None
            new_lines.append(line)
            i += 1
    
    new_content = '\n'.join(new_lines)
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: cleanup_duplicate_comments.py <go_file> [go_file2 ...]")
        sys.exit(1)
    
    for file_path in sys.argv[1:]:
        if cleanup_file(file_path):
            print(f"Cleaned {file_path}")
        else:
            print(f"No changes needed for {file_path}")

