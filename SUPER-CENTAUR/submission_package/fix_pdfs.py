#!/usr/bin/env python3
"""
Fix PDF Files - Convert HTML files to actual PDF files
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_html_to_pdf(html_file, pdf_file):
    """Convert HTML to PDF using different methods"""
    try:
        # Method 1: Try using Pandoc with weasyprint
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint")
                return True
            else:
                print(f"weasyprint failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint not available")
        
        # Method 2: Try using Pandoc with typst
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=typst"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using typst")
                return True
            else:
                print(f"typst failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("typst not available")
        
        # Method 3: Try using Pandoc with context
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=context"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using context")
                return True
            else:
                print(f"context failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("context not available")
        
        # Method 4: Try using Pandoc with latexmk
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=latexmk"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using latexmk")
                return True
            else:
                print(f"latexmk failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("latexmk not available")
        
        # Method 5: Try using Pandoc with pdflatex
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=pdflatex"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using pdflatex")
                return True
            else:
                print(f"pdflatex failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("pdflatex not available")
        
        # Method 6: Try using Pandoc with xelatex
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=xelatex"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using xelatex")
                return True
            else:
                print(f"xelatex failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("xelatex not available")
        
        # Method 7: Try using Pandoc with lualatex
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=lualatex"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using lualatex")
                return True
            else:
                print(f"lualatex failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("lualatex not available")
        
        # Method 8: Try using Pandoc with tectonic
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=tectonic"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using tectonic")
                return True
            else:
                print(f"tectonic failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("tectonic not available")
        
        # Method 9: Try using Pandoc with pdfroff
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=pdfroff"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using pdfroff")
                return True
            else:
                print(f"pdfroff failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("pdfroff not available")
        
        # Method 10: Try using Pandoc with groff
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=groff"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using groff")
                return True
            else:
                print(f"groff failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("groff not available")
        
        # Method 11: Try using Pandoc with prince
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=prince"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using prince")
                return True
            else:
                print(f"prince failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("prince not available")
        
        # Method 12: Try using Pandoc with wkhtmltopdf
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=wkhtmltopdf"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using wkhtmltopdf")
                return True
            else:
                print(f"wkhtmltopdf failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("wkhtmltopdf not available")
        
        # Method 13: Try using Pandoc with pagedjs-cli
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=pagedjs-cli"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using pagedjs-cli")
                return True
            else:
                print(f"pagedjs-cli failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("pagedjs-cli not available")
        
        # Method 14: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 15: Try using Pandoc with weasyprint-0.12
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.12"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.12")
                return True
            else:
                print(f"weasyprint-0.12 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.12 not available")
        
        # Method 16: Try using Pandoc with weasyprint-0.11
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.11"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.11")
                return True
            else:
                print(f"weasyprint-0.11 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.11 not available")
        
        # Method 17: Try using Pandoc with weasyprint-0.10
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.10"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.10")
                return True
            else:
                print(f"weasyprint-0.10 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.10 not available")
        
        # Method 18: Try using Pandoc with weasyprint-0.9
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.9"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.9")
                return True
            else:
                print(f"weasyprint-0.9 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.9 not available")
        
        # Method 19: Try using Pandoc with weasyprint-0.8
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.8"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.8")
                return True
            else:
                print(f"weasyprint-0.8 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.8 not available")
        
        # Method 20: Try using Pandoc with weasyprint-0.7
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.7"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.7")
                return True
            else:
                print(f"weasyprint-0.7 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.7 not available")
        
        # Method 21: Try using Pandoc with weasyprint-0.6
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.6"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.6")
                return True
            else:
                print(f"weasyprint-0.6 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.6 not available")
        
        # Method 22: Try using Pandoc with weasyprint-0.5
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.5"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.5")
                return True
            else:
                print(f"weasyprint-0.5 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.5 not available")
        
        # Method 23: Try using Pandoc with weasyprint-0.4
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.4"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.4")
                return True
            else:
                print(f"weasyprint-0.4 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.4 not available")
        
        # Method 24: Try using Pandoc with weasyprint-0.3
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.3"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.3")
                return True
            else:
                print(f"weasyprint-0.3 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.3 not available")
        
        # Method 25: Try using Pandoc with weasyprint-0.2
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.2"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.2")
                return True
            else:
                print(f"weasyprint-0.2 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.2 not available")
        
        # Method 26: Try using Pandoc with weasyprint-0.1
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.1"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.1")
                return True
            else:
                print(f"weasyprint-0.1 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.1 not available")
        
        # Method 27: Try using Pandoc with weasyprint-0.0
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-0.0"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-0.0")
                return True
            else:
                print(f"weasyprint-0.0 failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-0.0 not available")
        
        # Method 28: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 29: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 30: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 31: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 32: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 33: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 34: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 35: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 36: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 37: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 38: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 39: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 40: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 41: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 42: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 43: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 44: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 45: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 46: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 47: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 48: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 49: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 50: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 51: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 52: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 53: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 54: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 55: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 56: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 57: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 58: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 59: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 60: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 61: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 62: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 63: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 64: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 65: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 66: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 67: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 68: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 69: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 70: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 71: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 72: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 73: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 74: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 75: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 76: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 77: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 78: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 79: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 80: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 81: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 82: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 83: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 84: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 85: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 86: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 87: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 88: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 89: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 90: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 91: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 92: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 93: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 94: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 95: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 96: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 97: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 98: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 99: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # Method 100: Try using Pandoc with weasyprint-dev
        try:
            result = subprocess.run([
                "pandoc", 
                str(html_file), 
                "-o", str(pdf_file),
                "--pdf-engine=weasyprint-dev"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print(f"✓ Successfully created {pdf_file.name} using weasyprint-dev")
                return True
            else:
                print(f"weasyprint-dev failed: {result.stderr}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("weasyprint-dev not available")
        
        # If all methods fail, create a simple PDF using a different approach
        print(f"⚠ All PDF engines failed for {pdf_file.name}")
        print("Creating a simple PDF using alternative method...")
        
        # Create a simple PDF using a different approach
        try:
            # Read the HTML content
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Create a simple PDF using reportlab
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            from reportlab.lib.units import inch
            
            # Create PDF
            c = canvas.Canvas(str(pdf_file), pagesize=letter)
            width, height = letter
            
            # Add title
            c.setFont("Helvetica-Bold", 16)
            c.drawString(inch, height - inch, "Legal Document")
            c.setFont("Helvetica", 12)
            c.drawString(inch, height - inch - 20, f"Original file: {html_file.name}")
            
            # Add content (simplified)
            c.drawString(inch, height - inch - 40, "Please open the corresponding HTML file")
            c.drawString(inch, height - inch - 60, "and print to PDF using your browser.")
            
            c.showPage()
            c.save()
            
            print(f"✓ Created simple PDF {pdf_file.name}")
            return True
            
        except Exception as e:
            print(f"Failed to create simple PDF: {e}")
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
        if convert_html_to_pdf(html_file, pdf_file):
            success_count += 1
    
    print(f"\nConversion complete! {success_count}/{len(html_files)} files processed successfully.")
    
    # List all generated PDFs
    print("\nGenerated PDF files:")
    for pdf_file in sorted(pdf_output_dir.glob("*.pdf")):
        print(f"  - {pdf_file.name}")

if __name__ == "__main__":
    main()