#!/usr/bin/env python3
"""Remove duplicate consecutive comment blocks"""

import sys
import os

def remove_duplicates(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    prev_comment_block = None
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Check if this is a comment line (but not a struct comment)
        if stripped.startswith('//') and not stripped.startswith('// ') and not stripped.startswith('//type '):
            # Collect comment block
            comment_block = [line]
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('//'):
                comment_block.append(lines[j])
                j += 1
            
            # Check if this is a duplicate of previous
            if prev_comment_block and prev_comment_block == comment_block:
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
    
    new_content = ''.join(new_lines)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return new_content != ''.join(lines)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: remove_duplicate_comments.py <file1> [file2 ...]")
        sys.exit(1)
    
    for file_path in sys.argv[1:]:
        if remove_duplicates(file_path):
            print(f"Cleaned {file_path}")
        else:
            print(f"No changes needed for {file_path}")

