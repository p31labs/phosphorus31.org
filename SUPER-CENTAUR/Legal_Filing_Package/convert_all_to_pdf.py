#!/usr/bin/env python3
"""
Legal Document PDF Converter
Converts all markdown files in the Legal_Filing_Package to PDF format
"""

import os
import subprocess
import sys
from pathlib import Path

def install_weasyprint():
    """Install weasyprint if not available"""
    try:
        import weasyprint
        print("✓ WeasyPrint is already available")
        return True
    except ImportError:
        print("Installing WeasyPrint...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "weasyprint"])
            print("✓ WeasyPrint installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to install WeasyPrint: {e}")
            return False

def convert_markdown_to_pdf(input_file, output_file, pandoc_path):
    """Convert a single markdown file to PDF using Pandoc with weasyprint"""
    try:
        # First convert to HTML
        html_file = output_file.replace('.pdf', '.html')
        
        cmd_html = [
            pandoc_path,
            input_file,
            '-o', html_file,
            '--standalone',
            '--metadata', 'title=Legal Document',
            '--css', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css'
        ]
        
        print(f"Converting {input_file} to HTML...")
        result = subprocess.run(cmd_html, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error converting to HTML: {result.stderr}")
            return False
        
        # Then convert HTML to PDF using weasyprint
        try:
            import weasyprint
            print(f"Converting {html_file} to PDF...")
            weasyprint.HTML(html_file).write_pdf(output_file)
            print(f"✓ Successfully created {output_file}")
            return True
        except ImportError:
            print("WeasyPrint not available, trying alternative method...")
            # Try using Pandoc with weasyprint as PDF engine
            cmd_pdf = [
                pandoc_path,
                html_file,
                '-o', output_file,
                '--pdf-engine=weasyprint'
            ]
            result = subprocess.run(cmd_pdf, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✓ Successfully created {output_file}")
                return True
            else:
                print(f"Error converting to PDF: {result.stderr}")
                return False
                
    except Exception as e:
        print(f"Error converting {input_file}: {e}")
        return False

def main():
    # Get the current directory (we're already in Legal_Filing_Package)
    current_dir = Path.cwd()
    package_dir = current_dir
    pdf_output_dir = package_dir / "PDF_Output"
    
    # Create PDF output directory if it doesn't exist
    pdf_output_dir.mkdir(exist_ok=True)
    
    # Find pandoc executable
    pandoc_path = package_dir / "pandoc.exe"
    if not pandoc_path.exists():
        print("✗ Pandoc executable not found!")
        return
    
    print("✓ Pandoc found")
    
    # Install weasyprint
    if not install_weasyprint():
        print("Continuing without WeasyPrint...")
    
    # List of markdown files to convert
    markdown_files = [
        "Motion_to_Vacate_Void_Judgment.md",
        "Motion_to_Seal_and_Redact.md", 
        "Motion_for_TSP_Loss_Allocation.md",
        "Motion_for_Medical_Device_Protection.md",
        "Motion_for_Forensic_Accounting.md",
        "Verification_Page.md",
        "Exhibit_Index.md",
        "Exhibit_A_Welch_Refund.md",
        "Exhibit_B_Hypoparathyroidism.md",
        "Exhibit_C_ASD_Diagnosis.md",
        "Exhibit_D_ADHD_Diagnosis.md",
        "Exhibit_E_Camden_Behavioral_Wellness.md",
        "Exhibit_F_Termination_Email.md",
        "Exhibit_G_Void_Consent_Order.md",
        "Exhibit_H_ADA_Accommodation.md",
        "Exhibit_I_Technical_Manual.md",
        "Exhibit_J_Tetrahedron_Protocol.md"
    ]
    
    # Convert each file
    success_count = 0
    for i, md_file in enumerate(markdown_files, 1):
        input_path = package_dir / md_file
        if input_path.exists():
            output_file = pdf_output_dir / f"{i:02d}_{md_file.replace('.md', '.pdf')}"
            if convert_markdown_to_pdf(str(input_path), str(output_file), str(pandoc_path)):
                success_count += 1
        else:
            print(f"✗ File not found: {md_file}")
    
    print(f"\nConversion complete! {success_count}/{len(markdown_files)} files converted successfully.")
    
    # List all generated PDFs
    print("\nGenerated PDF files:")
    for pdf_file in sorted(pdf_output_dir.glob("*.pdf")):
        print(f"  - {pdf_file.name}")

if __name__ == "__main__":
    main()