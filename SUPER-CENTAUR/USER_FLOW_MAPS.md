# SUPER CENTAUR User Flow Maps

## 1. Legal Strategy Generation

**Goal:** Generate a legal document (e.g., Motion) based on user input.

**Current Flow:**
1.  User lands on Dashboard (`/`).
2.  Clicks "Legal AI" (`/legal`).
3.  Enters case details in `textarea`.
4.  Clicks "Analyze Case".
5.  Wait for Analysis.
6.  Scrolls down to "Document Templates".
7.  Clicks "Generate" on a template.
8.  Document appears in "Generated Documents".
9.  Clicks "View" or "Download".

**Issues:**
- Step 5: If analysis fails, user is stuck.
- Step 6: Templates are generic, not necessarily linked to the specific analysis result.

**Proposed Improvement:**
1.  User enters case details -> Click "Analyze Case".
2.  Analysis results appear with **Suggested Documents** highlighted based on the analysis.
3.  One-click "Generate Recommended Strategy" which bundles the relevant documents.
4.  Progress indicator during generation.
5.  Success toast notification with "Download All" option.

## 2. Family Protection Monitoring

**Goal:** Monitor family safety status.

**Current Flow:**
1.  User lands on Dashboard.
2.  Checks "Love Economy" or "Medical Hub" manually? (No specific "Family Protection" route active yet, placeholder `/family` exists).

**Proposed Flow (New Module):**
1.  User clicks "Family Shield" in sidebar.
2.  Dashboard shows real-time status of:
    -   Location (if applicable/safe).
    -   Communication logs.
    -   Restraining Order Status (Active/Expiring).
3.  "Emergency Action" button (Red) -> Generates immediate legal/police report.

## 3. Medical Documentation Management

**Goal:** Log a new medical event/document.

**Current Flow:**
1.  User lands on Dashboard (`/`).
2.  Clicks "Medical Hub" (`/medical`).
3.  Fills out "Add Medical Document" form.
4.  Clicks "Add Document".
5.  List updates below.

**Issues:**
- Form is basic.
- No file upload capability (only text content).

**Proposed Improvement:**
1.  "Quick Add" button on main Dashboard for medical events.
2.  File Drag & Drop area for PDF/Image uploads (OCR processing in background).
3.  Timeline view of medical history instead of just a list.

## 4. Quantum Brain Decision Optimization

**Goal:** Get a system recommendation.

**Current Flow:**
1.  User looks at `TheObserverDashboard` to see "GO/NO-GO" status.
2.  No clear action to *influence* or *query* the decision engine directly from the UI.

**Proposed Improvement:**
1.  "Query The Oracle" / "Ask Quantum Brain" input on the main dashboard.
2.  User asks: "Should I file the motion today?"
3.  System analyzes Legal + Medical + Financial status -> Returns "GO (95% Confidence)" with reasoning.
