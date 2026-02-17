# Drive Librarian 📚

**Automated document organization, PII redaction, and evidence categorization for Google Drive**

Created for Will Johnson by Claude | January 19, 2026

---

## What It Does

### 🔒 PII Detection & Reversible Redaction
- Detects: SSNs, phone numbers, emails, credit cards, addresses, names, dates of birth, IP addresses
- Uses **Presidio** (Microsoft's PII engine) + **spaCy NLP** for high accuracy
- **Reversible**: Original files backed up before redaction - can be restored anytime

### 📊 Evidence Categorization
- Automatically scans documents for scientific claims
- Color-codes by evidence level:
  - 🟢 **VERIFIED**: Peer-reviewed, replicated, RCTs, meta-analyses
  - 🟡 **SUPPORTED**: Published research, not yet replicated
  - 🔵 **THEORETICAL**: Mathematically sound, not empirically tested
  - 🔴 **SPECULATIVE**: Hypotheses, preliminary evidence
  - ⚪ **UNVERIFIED**: No source found

### 📁 Automatic Organization
- Categorizes files by content: Research, Protocols, Technical, Legal, Personal
- Moves files to appropriate subfolders
- Generates processing reports

---

## Two Versions

### 1. Google Apps Script (Lightweight)
- Runs entirely within Google Drive
- Free, no server needed
- Scheduled automation
- Best for: Ongoing maintenance

### 2. Python CLI (Heavy-Duty)
- Advanced NLP with spaCy + Presidio
- Comprehensive validation reports
- Batch processing with progress tracking
- Best for: Initial cleanup, deep analysis

---

## Quick Start

### Google Apps Script Setup

1. Go to [script.google.com](https://script.google.com)
2. Create new project → Name it "Drive Librarian"
3. Copy contents of `apps_script/DriveLibrarian.gs` into Code.gs
4. **Update line 13**: Set your folder name (default: `<3`)
5. Run → `setupLibrarian`
6. Authorize when prompted
7. Run → `createScheduledTriggers` (enables daily automation)

**Manual runs:**
- `runFullLibrarianProcess` - Full processing
- `runQuickScan` - Only new/modified files
- `listBackups` - Show backed-up originals
- `restoreFromBackup("filename")` - Restore a redacted file

---

### Python CLI Setup

#### 1. Install Dependencies

```bash
cd python_cli
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

#### 2. Set Up Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable APIs:
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Slides API
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID** (Desktop application)
6. Download JSON → rename to `credentials.json`
7. Place in `python_cli/` directory

#### 3. Initialize

```bash
python drive_librarian.py setup --folder-name "<3"
```

This will:
- Authenticate with Google
- Find/create your root folder
- Create organizational subfolders
- Save configuration

#### 4. Process Files

```bash
# Full processing
python drive_librarian.py process

# Preview without making changes
python drive_librarian.py process --dry-run

# Skip PII redaction (only categorize)
python drive_librarian.py process --no-redact
```

#### 5. Other Commands

```bash
# Check status
python drive_librarian.py status

# List all backups
python drive_librarian.py list-backups

# Restore a file
python drive_librarian.py restore "My Document"
```

---

## Folder Structure Created

```
<3/
├── _Archive/              # Old/archived files
├── _Redacted_Originals/   # Backups before PII removal
├── _Validation_Reports/   # Processing reports
├── Research/              # Research docs
├── Protocols/             # Protocols & procedures  
├── Technical/             # Technical documentation
├── Legal/                 # Legal documents
├── Personal/              # Personal docs
└── Miscellaneous/         # Uncategorized
```

---

## Evidence Level Markers

The system looks for these keywords to categorize claims:

### 🟢 VERIFIED
`peer-reviewed`, `replicated`, `meta-analysis`, `systematic review`, `confirmed`, `established`, `proven`, `demonstrated`, `validated`, `NIST`, `FDA approved`, `clinical trial`, `phase 3`, `RCT`, `Nature`, `Science`, `PNAS`

### 🟡 SUPPORTED
`published`, `study found`, `research shows`, `evidence suggests`, `literature indicates`, `data shows`, `observed`, `measured`, `experiment showed`

### 🔵 THEORETICAL
`mathematically`, `in principle`, `theoretically`, `model predicts`, `simulation`, `calculation shows`, `proof`, `theorem`, `derivation`

### 🔴 SPECULATIVE
`hypothesis`, `proposed`, `may`, `might`, `could`, `possibly`, `speculative`, `preliminary`, `exploratory`, `pilot`, `suggests`, `we believe`

---

## PII Types Detected

| Type | Examples |
|------|----------|
| US_SSN | 123-45-6789 |
| PHONE_NUMBER | (555) 123-4567, +1-555-123-4567 |
| EMAIL_ADDRESS | name@example.com |
| CREDIT_CARD | 4111-1111-1111-1111 |
| PERSON | Names (via NLP) |
| LOCATION | Addresses (via NLP) |
| DATE_TIME | Dates of birth |
| IP_ADDRESS | 192.168.1.1 |

---

## Restoring Redacted Files

Every file is backed up before redaction. To restore:

### Apps Script
```javascript
restoreFromBackup("Document Name")
```

### Python CLI
```bash
python drive_librarian.py restore "Document Name"
```

Restored files appear in the root folder with `_RESTORED` suffix.

---

## Configuration

### Apps Script
Edit the `CONFIG` object at the top of `DriveLibrarian.gs`

### Python CLI
Edit `librarian_config.yaml` (created during setup)

---

## Customization

### Adding PII Patterns (Apps Script)
Add to `CONFIG.PII_PATTERNS`:
```javascript
MY_PATTERN: /your-regex-here/g
```

### Adding Evidence Markers
Add to `CONFIG.EVIDENCE_MARKERS` or `EVIDENCE_MARKERS`:
```javascript
VERIFIED: [..., "your new marker"]
```

### Adding Category Keywords
Add to `CONFIG.CATEGORY_KEYWORDS` or `CATEGORY_KEYWORDS`:
```javascript
"NewCategory": ["keyword1", "keyword2"]
```

---

## Troubleshooting

### "Folder not found"
- Make sure the folder name matches exactly (case-sensitive)
- The folder must be in your Drive, not Shared with you

### "Authorization required"
- Apps Script: Run a function manually first to trigger OAuth
- Python: Delete `token.json` and re-run

### "Quota exceeded"
- Google APIs have daily limits
- Wait 24 hours or use a different Google Cloud project

### PII still showing
- Some PII patterns might not match exactly
- Check the backup folder for original
- Add custom patterns for edge cases

---

## Privacy & Security

- **All processing happens within Google's ecosystem** (Apps Script) or **locally** (Python)
- No data sent to external servers
- Originals preserved in `_Redacted_Originals` folder
- You control what gets processed

---

## License

MIT - Do whatever you want with it. 💜

---

## Support

This tool was built with love for the Phenix Navigator project.

Questions? Issues? The code is well-documented - dive in!

*"Trust the Geometry. Stay Liquid."*
