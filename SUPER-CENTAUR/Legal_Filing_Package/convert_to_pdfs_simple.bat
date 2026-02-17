@echo off
echo Converting Legal Documents to Court-Ready PDFs...
echo =================================================

REM Check if Pandoc is installed
where pandoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Pandoc not found. Please install Pandoc and try again.
    echo Download from: https://pandoc.org/installing.html
    pause
    exit /b 1
)

REM Create output directory
if not exist "PDF_Output" mkdir "PDF_Output"

echo Converting Motions...
echo --------------------

REM Motion to Vacate Void Judgment
pandoc "Motion_to_Vacate_Void_Judgment.md" -o "PDF_Output/01_Motion_to_Vacate_Void_Judgment.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Motion to Seal and Redact
pandoc "Motion_to_Seal_and_Redact.md" -o "PDF_Output/02_Motion_to_Seal_and_Redact.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Motion for TSP Loss Allocation
pandoc "Motion_for_TSP_Loss_Allocation.md" -o "PDF_Output/03_Motion_for_TSP_Loss_Allocation.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Motion for Medical Device Protection
pandoc "Motion_for_Medical_Device_Protection.md" -o "PDF_Output/04_Motion_for_Medical_Device_Protection.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Motion for Forensic Accounting
pandoc "Motion_for_Forensic_Accounting.md" -o "PDF_Output/05_Motion_for_Forensic_Accounting.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

echo Converting Verification...
echo -------------------------

REM Verification Page
pandoc "Verification_Page.md" -o "PDF_Output/06_Verification_Page.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

echo Converting Exhibits...
echo ---------------------

REM Exhibit Index
pandoc "Exhibit_Index.md" -o "PDF_Output/07_Exhibit_Index.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit A
pandoc "Exhibit_A_Welch_Refund.md" -o "PDF_Output/08_Exhibit_A_Welch_Refund.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit B
pandoc "Exhibit_B_Hypoparathyroidism.md" -o "PDF_Output/09_Exhibit_B_Hypoparathyroidism.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit C
pandoc "Exhibit_C_ASD_Diagnosis.md" -o "PDF_Output/10_Exhibit_C_ASD_Diagnosis.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit D
pandoc "Exhibit_D_ADHD_Diagnosis.md" -o "PDF_Output/11_Exhibit_D_ADHD_Diagnosis.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit E
pandoc "Exhibit_E_Camden_Behavioral_Wellness.md" -o "PDF_Output/12_Exhibit_E_Camden_Behavioral_Wellness.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit F
pandoc "Exhibit_F_Termination_Email.md" -o "PDF_Output/13_Exhibit_F_Termination_Email.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit G
pandoc "Exhibit_G_Void_Consent_Order.md" -o "PDF_Output/14_Exhibit_G_Void_Consent_Order.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit H
pandoc "Exhibit_H_ADA_Accommodation.md" -o "PDF_Output/15_Exhibit_H_ADA_Accommodation.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit I
pandoc "Exhibit_I_Technical_Manual.md" -o "PDF_Output/16_Exhibit_I_Technical_Manual.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

REM Exhibit J
pandoc "Exhibit_J_Tetrahedron_Protocol.md" -o "PDF_Output/17_Exhibit_J_Tetrahedron_Protocol.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

echo Converting Filing Instructions...
echo --------------------------------

REM Complete Filing Instructions
pandoc "COMPLETE_FILING_INSTRUCTIONS.md" -o "PDF_Output/18_Complete_Filing_Instructions.pdf" --pdf-engine=xelatex --variable mainfont="Georgia" --variable fontsize=12pt --variable linestretch=1.5 --variable geometry:margin=1in

echo =================================================
echo PDF Conversion Complete!
echo =================================================
echo 
echo All documents have been converted to court-ready PDFs:
echo 
echo Location: Legal_Filing_Package\PDF_Output\
echo 
echo Files Created:
echo - 01_Motion_to_Vacate_Void_Judgment.pdf
echo - 02_Motion_to_Seal_and_Redact.pdf
echo - 03_Motion_for_TSP_Loss_Allocation.pdf
echo - 04_Motion_for_Medical_Device_Protection.pdf
echo - 05_Motion_for_Forensic_Accounting.pdf
echo - 06_Verification_Page.pdf
echo - 07_Exhibit_Index.pdf
echo - 08_Exhibit_A_Welch_Refund.pdf
echo - 09_Exhibit_B_Hypoparathyroidism.pdf
echo - 10_Exhibit_C_ASD_Diagnosis.pdf
echo - 11_Exhibit_D_ADHD_Diagnosis.pdf
echo - 12_Exhibit_E_Camden_Behavioral_Wellness.pdf
echo - 13_Exhibit_F_Termination_Email.pdf
echo - 14_Exhibit_G_Void_Consent_Order.pdf
echo - 15_Exhibit_H_ADA_Accommodation.pdf
echo - 16_Exhibit_I_Technical_Manual.pdf
echo - 17_Exhibit_J_Tetrahedron_Protocol.pdf
echo - 18_Complete_Filing_Instructions.pdf
echo 
echo Next Steps:
echo 1. Review all PDFs for accuracy
echo 2. Print 3 copies of each document
echo 3. File with Camden County Superior Court
echo 4. Serve opposing counsel
echo 
pause