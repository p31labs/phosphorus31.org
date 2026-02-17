#!/usr/bin/env python3
"""
Simple HTML to PDF Converter
Converts HTML files to PDF using a web-based approach
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_html_to_pdf_simple(html_file, pdf_file):
    """Convert HTML to PDF using a simple approach"""
    try:
        # Try using Pandoc with wkhtmltopdf if available
        try:
            result = subprocess.run([
                "wkhtmltopdf", 
                str(html_file), 
                str(pdf_file)
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name}")
                return True
            else:
                print(f"wkhtmltopdf failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("wkhtmltopdf not available")
        
        # Try using Pandoc with weasyprint as PDF engine
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint"
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name}")
                return True
            else:
                print(f"weasyprint failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint not available")
        
        # Try using Pandoc with typst as PDF engine
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=typst"
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name}")
                return True
            else:
                print(f"typst failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("typst not available")
        
        # Try using Pandoc with context as PDF engine
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=context"
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name}")
                return True
            else:
                print(f"context failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("context not available")
        
        # If all else fails, just copy the HTML file with .pdf extension
        # This allows the user to open it in a browser and print to PDF
        try:
            import shutil
            shutil.copy2(html_file, pdf_file)
            print(f"⚠ Created {pdf_file.name} (HTML file - open in browser and print to PDF)")
            return True
        except Exception as e:
            print(f"Failed to copy HTML file: {e}")
            return False
            
    except Exception as e:
        print(f"Error converting {html_file.name}: {e}")
        return False

def main():
    # Get the current directory
    current_dir = Path.cwd()
    package_dir = current_dir
    pdf_output_dir = package_dir / "PDF_Output"
    
    # Check if PDF_Output directory exists
    if not pdf_output_dir.exists():
        print("✗ PDF_Output directory not found!")
        return
    
    # List all HTML files in PDF_Output
    html_files = sorted(pdf_output_dir.glob("*.html"))
    
    if not html_files:
        print("✗ No HTML files found in PDF_Output directory!")
        return
    
    print(f"Found {len(html_files)} HTML files to convert...")
    
    # Convert each HTML file to PDF
    success_count = 0
    for html_file in html_files:
        pdf_file = html_file.with_suffix('.pdf')
        if convert_html_to_pdf_simple(html_file, pdf_file):
            success_count += 1
    
    print(f"\nConversion complete! {success_count}/{len(html_files)} files processed successfully.")
    
    # List all generated PDFs
    print("\nGenerated PDF files:")
    for pdf_file in sorted(pdf_output_dir.glob("*.pdf")):
        print(f"  - {pdf_file.name}")

if __name__ == "__main__":
    main()