#!/usr/bin/env python3
"""
Convert submission package documents to PDF format
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_md_to_pdf(md_file, pdf_file):
    """Convert markdown file to PDF using pandoc"""
    try:
        cmd = [
            'pandoc', 
            str(md_file),
            '-o', str(pdf_file),
            '--pdf-engine=pdflatex',
            '--variable', 'mainfont=Georgia',
            '--variable', 'fontsize=12pt',
            '--variable', 'linestretch=1.5',
            '--variable', 'geometry:margin=1in',
            '--toc'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✓ {md_file.name} → {pdf_file.name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error converting {md_file.name}: {e}")
        print(f"Error output: {e.stderr}")
        return False
    except FileNotFoundError:
        print("✗ Pandoc not found. Please install pandoc and LaTeX.")
        return False

def main():
    # Already in submission_package directory
    pass
    
    # Create PDF output directory
    pdf_dir = Path('PDF_Output')
    pdf_dir.mkdir(exist_ok=True)
    
    # List of documents to convert
    documents_to_convert = [
        'OMNIBUS_MOTION_FOR_EMERGENCY_RELIEF.md',
        'MASTER_EXHIBIT_LIST.md',
        'FILING_CHECKLIST_AND_INSTRUCTIONS.md',
        'SUBMISSION_PACKAGE_SUMMARY.md',
        'STATE_BAR_GRIEVANCE_MCGHAN.md',
        'STATE_BAR_GRIEVANCE_EAST.md',
        'STATE_BAR_GRIEVANCE_WELCH.md',
        'EXHIBIT_A_TSP_PAYMENT_CONFIRMATION.md',
        'EXHIBIT_B_TSP_PAYMENT_RIGHTS_NOTICE.md',
        'EXHIBIT_C_COURT_ORDERS_AND_POWER_OF_ATTORNEY.md',
        'EXHIBIT_D_MORTGAGE_STATEMENT_AND_ARREARS_ANALYSIS.md',
        'EXHIBIT_E_MEDICAL_DOCUMENTATION_AND_DIAGNOSES.md',
        'EXHIBIT_F_ACCOMMODATION_REQUEST_AND_REJECTION.md',
        'EXHIBIT_G_VOID_CONSENT_ORDER_AND_FRAUDULENT_SIGNATURES.md',
        'EXHIBIT_H_PHENIX_NAVIGATOR_TECHNICAL_MANUAL.md',
        'EXHIBIT_I_TETRAHEDRON_PROTOCOL_AND_QUANTUM_BIOLOGY.md',
        'EXHIBIT_J_ACCIDENT_REPORT_AND_INSURANCE_ANALYSIS.md',
        'EXHIBIT_K_FINANCIAL_DISCREPANCY_ANALYSIS.md',
        'EXHIBIT_L_PHENIX_NAVIGATOR_MEDICAL_DEFENSE.md',
        'EXHIBIT_M_TAX_LAW_ANALYSIS_AND_RBCO_REQUIREMENTS.md',
        'EXHIBIT_N_CHILD_PROTECTION_ANALYSIS.md',
        'EXHIBIT_O_FINAL_COMPREHENSIVE_ANALYSIS.md',
        'EXHIBIT_P_PHENIX_NAVIGATOR_MEDICAL_DEFENSE.md',
        'VERIFIED_FINANCIAL_ANALYSIS_REPORT.md',
        'CLEAR_ASSET_SEPARATION_REPORT.md',
        'COURT_PRESENTATION_SUMMARY.md',
        'COURT_READY_FINANCIAL_ANALYSIS.md',
        'DISCOVERY_STRATEGY_PACKAGE.md',
        'SCOPE_LIMITATIONS_AND_FINDINGS_SUMMARY.md',
        'financial_discrepancy_analysis.md',
        'court_filing_summary.md'
    ]
    
    print("Converting Submission Package Documents to PDF...")
    print("=" * 60)
    
    success_count = 0
    total_count = len(documents_to_convert)
    
    for doc_name in documents_to_convert:
        md_file = Path(doc_name)
        if md_file.exists():
            pdf_file = pdf_dir / f"{md_file.stem}.pdf"
            if convert_md_to_pdf(md_file, pdf_file):
                success_count += 1
        else:
            print(f"✗ File not found: {doc_name}")
    
    print("=" * 60)
    print(f"Conversion complete: {success_count}/{total_count} documents converted")
    
    # Convert the Word document to PDF if it exists
    word_doc = Path('Omnibus Motion for Emergency Relief (1).docx')
    if word_doc.exists():
        print(f"\nConverting Word document: {word_doc.name}")
        pdf_file = pdf_dir / "Omnibus_Motion_for_Emergency_Relief.pdf"
        try:
            cmd = ['pandoc', str(word_doc), '-o', str(pdf_file)]
            subprocess.run(cmd, check=True)
            print(f"✓ {word_doc.name} → {pdf_file.name}")
        except subprocess.CalledProcessError:
            print(f"✗ Error converting {word_doc.name}")

if __name__ == '__main__':
    main()