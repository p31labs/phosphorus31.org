/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DRIVE LIBRARIAN - Google Apps Script
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automated document organization, PII redaction, and evidence categorization
 * for the <3 folder and subfolders.
 * 
 * Author: Will Johnson / Claude
 * Version: 1.0.0
 * Date: January 19, 2026
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create new project named "Drive Librarian"
 * 3. Copy this entire file into Code.gs
 * 4. Run setupLibrarian() once to create folder structure
 * 5. Run createScheduledTriggers() to enable automation
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // The main folder to process (change this to your <3 folder ID)
  // To find folder ID: open folder in Drive, copy the ID from the URL
  // https://drive.google.com/drive/folders/FOLDER_ID_IS_HERE
  ROOT_FOLDER_NAME: "<3",
  
  // Subfolder names for organization
  FOLDERS: {
    ARCHIVE: "_Archive",
    REDACTED_ORIGINALS: "_Redacted_Originals",  // Stores original versions before redaction
    VALIDATION_REPORTS: "_Validation_Reports",
    RESEARCH: "Research",
    PROTOCOLS: "Protocols",
    TECHNICAL: "Technical",
    LEGAL: "Legal",
    PERSONAL: "Personal",
    MISC: "Miscellaneous"
  },
  
  // Evidence level colors (for highlighting)
  EVIDENCE_COLORS: {
    VERIFIED: "#C6EFCE",      // Green - peer-reviewed, replicated
    SUPPORTED: "#FFEB9C",     // Yellow - published but not replicated
    THEORETICAL: "#B4C6E7",   // Blue - mathematically sound, not tested
    SPECULATIVE: "#F4CCCC",   // Pink - hypothesis, limited evidence
    UNVERIFIED: "#D9D9D9"     // Gray - no source found
  },
  
  // Keywords that indicate evidence levels
  EVIDENCE_MARKERS: {
    VERIFIED: [
      "peer-reviewed", "replicated", "meta-analysis", "systematic review",
      "confirmed", "established", "proven", "demonstrated", "validated",
      "NIST", "FDA approved", "clinical trial", "phase 3", "RCT"
    ],
    SUPPORTED: [
      "published", "study found", "research shows", "evidence suggests",
      "literature indicates", "data shows", "observed", "measured"
    ],
    THEORETICAL: [
      "mathematically", "in principle", "theoretically", "model predicts",
      "simulation", "calculation shows", "proof", "theorem"
    ],
    SPECULATIVE: [
      "hypothesis", "proposed", "may", "might", "could", "possibly",
      "speculative", "preliminary", "exploratory", "pilot"
    ]
  },
  
  // PII patterns to detect and redact
  PII_PATTERNS: {
    SSN: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    PHONE: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    CREDIT_CARD: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
    DOB: /\b(?:DOB|Date of Birth|Born)[:\s]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
    ADDRESS: /\b\d{1,5}\s+(?:[A-Za-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Circle|Cir)\.?\s*(?:,?\s*(?:Apt|Suite|Unit|#)\s*\d+)?/gi,
    IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  },
  
  // File categorization keywords
  CATEGORY_KEYWORDS: {
    RESEARCH: ["research", "study", "analysis", "synthesis", "literature", "review", "findings"],
    PROTOCOLS: ["protocol", "procedure", "methodology", "framework", "checklist", "workflow"],
    TECHNICAL: ["technical", "engineering", "hardware", "software", "code", "implementation", "specification", "architecture"],
    LEGAL: ["legal", "court", "custody", "contract", "agreement", "filing", "motion", "attorney"],
    PERSONAL: ["personal", "journal", "diary", "reflection", "memoir", "family"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initial setup - creates folder structure and validates configuration
 * Run this ONCE when first setting up the librarian
 */
function setupLibrarian() {
  const ui = SpreadsheetApp.getUi ? SpreadsheetApp.getUi() : null;
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("DRIVE LIBRARIAN SETUP");
  console.log("═══════════════════════════════════════════════════════════════");
  
  // Find or create root folder
  const rootFolder = findOrCreateFolder(CONFIG.ROOT_FOLDER_NAME, null);
  if (!rootFolder) {
    console.error("ERROR: Could not find or create root folder: " + CONFIG.ROOT_FOLDER_NAME);
    return;
  }
  console.log("✓ Root folder: " + rootFolder.getName() + " (" + rootFolder.getId() + ")");
  
  // Create organizational subfolders
  for (const [key, name] of Object.entries(CONFIG.FOLDERS)) {
    const folder = findOrCreateFolder(name, rootFolder);
    console.log("✓ Created/found subfolder: " + name);
  }
  
  // Create properties to track state
  const props = PropertiesService.getScriptProperties();
  props.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
  props.setProperty("SETUP_COMPLETE", "true");
  props.setProperty("LAST_RUN", "never");
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("SETUP COMPLETE");
  console.log("Next: Run createScheduledTriggers() to enable automation");
  console.log("═══════════════════════════════════════════════════════════════");
}

/**
 * Creates time-based triggers for automated processing
 */
function createScheduledTriggers() {
  // Remove existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Daily full processing at 3 AM
  ScriptApp.newTrigger("runFullLibrarianProcess")
    .timeBased()
    .everyDays(1)
    .atHour(3)
    .create();
  
  // Hourly quick scan for new files
  ScriptApp.newTrigger("runQuickScan")
    .timeBased()
    .everyHours(1)
    .create();
  
  console.log("✓ Created daily trigger (3 AM): Full processing");
  console.log("✓ Created hourly trigger: Quick scan for new files");
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PROCESSING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Main entry point - runs full librarian processing
 */
function runFullLibrarianProcess() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("DRIVE LIBRARIAN - Full Processing Run");
  console.log("Time: " + new Date().toISOString());
  console.log("═══════════════════════════════════════════════════════════════");
  
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  
  if (!rootFolderId) {
    console.error("ERROR: Setup not complete. Run setupLibrarian() first.");
    return;
  }
  
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const stats = {
    filesProcessed: 0,
    piiRedacted: 0,
    claimsCategorized: 0,
    filesOrganized: 0,
    errors: []
  };
  
  // Process all files recursively
  processFolder(rootFolder, stats);
  
  // Log results
  props.setProperty("LAST_RUN", new Date().toISOString());
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("PROCESSING COMPLETE");
  console.log("Files processed: " + stats.filesProcessed);
  console.log("PII instances redacted: " + stats.piiRedacted);
  console.log("Claims categorized: " + stats.claimsCategorized);
  console.log("Files organized: " + stats.filesOrganized);
  if (stats.errors.length > 0) {
    console.log("Errors: " + stats.errors.length);
    stats.errors.forEach(e => console.log("  - " + e));
  }
  console.log("═══════════════════════════════════════════════════════════════");
  
  // Generate summary report
  generateProcessingReport(stats);
}

/**
 * Quick scan - only processes files modified since last run
 */
function runQuickScan() {
  const props = PropertiesService.getScriptProperties();
  const lastRun = props.getProperty("LAST_RUN");
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  
  if (!rootFolderId || lastRun === "never") {
    console.log("Quick scan skipped - full run not yet completed");
    return;
  }
  
  const lastRunDate = new Date(lastRun);
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  
  console.log("Quick scan: Looking for files modified since " + lastRun);
  
  const stats = { filesProcessed: 0, piiRedacted: 0, claimsCategorized: 0, filesOrganized: 0, errors: [] };
  processFolder(rootFolder, stats, lastRunDate);
  
  if (stats.filesProcessed > 0) {
    console.log("Quick scan processed " + stats.filesProcessed + " modified files");
  }
}

/**
 * Recursively processes all files in a folder
 */
function processFolder(folder, stats, modifiedSince = null) {
  // Skip system folders
  const folderName = folder.getName();
  if (folderName.startsWith("_")) {
    return;
  }
  
  // Process files in this folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    
    // Skip if not modified since last run (for quick scan)
    if (modifiedSince && file.getLastUpdated() < modifiedSince) {
      continue;
    }
    
    try {
      processFile(file, folder, stats);
      stats.filesProcessed++;
    } catch (e) {
      stats.errors.push(file.getName() + ": " + e.message);
    }
  }
  
  // Process subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    processFolder(subfolders.next(), stats, modifiedSince);
  }
}

/**
 * Processes a single file
 */
function processFile(file, parentFolder, stats) {
  const mimeType = file.getMimeType();
  const fileName = file.getName();
  
  console.log("Processing: " + fileName);
  
  // Only process Google Docs, Sheets, Slides
  if (mimeType === MimeType.GOOGLE_DOCS) {
    processGoogleDoc(file, stats);
  } else if (mimeType === MimeType.GOOGLE_SHEETS) {
    processGoogleSheet(file, stats);
  } else if (mimeType === MimeType.GOOGLE_SLIDES) {
    processGoogleSlides(file, stats);
  }
  
  // Categorize and potentially move file
  const category = categorizeFile(file);
  if (category && shouldMoveFile(file, parentFolder, category)) {
    moveFileToCategory(file, category, stats);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE DOCS PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes a Google Doc for PII and evidence categorization
 */
function processGoogleDoc(file, stats) {
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();
  const text = body.getText();
  
  // Step 1: Detect and redact PII
  const piiResults = detectAndRedactPII(doc, body, text, file, stats);
  
  // Step 2: Categorize evidence claims
  const evidenceResults = categorizeEvidence(doc, body, text, stats);
  
  // Save changes
  doc.saveAndClose();
}

/**
 * Detects and redacts PII, storing original in backup
 */
function detectAndRedactPII(doc, body, text, file, stats) {
  const piiFound = [];
  
  // Check each PII pattern
  for (const [type, pattern] of Object.entries(CONFIG.PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        piiFound.push({ type: type, value: match });
      });
    }
  }
  
  if (piiFound.length === 0) {
    return { found: false, count: 0 };
  }
  
  // Store original version before redacting
  storeOriginalVersion(file, piiFound);
  
  // Perform redaction
  for (const pii of piiFound) {
    const redactedValue = generateRedactionPlaceholder(pii.type, pii.value);
    body.replaceText(escapeRegex(pii.value), redactedValue);
    stats.piiRedacted++;
  }
  
  // Add redaction notice at the top
  const notice = body.insertParagraph(0, "⚠️ PII REDACTED: " + piiFound.length + " item(s) on " + new Date().toLocaleDateString());
  notice.setForegroundColor("#CC0000");
  notice.setItalic(true);
  
  return { found: true, count: piiFound.length, items: piiFound };
}

/**
 * Generates a redaction placeholder that indicates type but hides value
 */
function generateRedactionPlaceholder(type, value) {
  const placeholders = {
    SSN: "[SSN-REDACTED]",
    PHONE: "[PHONE-REDACTED]",
    EMAIL: "[EMAIL-REDACTED]",
    CREDIT_CARD: "[CC-REDACTED]",
    DOB: "[DOB-REDACTED]",
    ADDRESS: "[ADDRESS-REDACTED]",
    IP_ADDRESS: "[IP-REDACTED]"
  };
  return placeholders[type] || "[REDACTED]";
}

/**
 * Stores original version of file before redaction
 */
function storeOriginalVersion(file, piiFound) {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const archiveFolder = findOrCreateFolder(CONFIG.FOLDERS.REDACTED_ORIGINALS, rootFolder);
  
  // Create a copy in the archive
  const timestamp = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd_HHmmss");
  const backupName = file.getName() + "_ORIGINAL_" + timestamp;
  const backup = file.makeCopy(backupName, archiveFolder);
  
  // Add metadata note about what was redacted
  const description = "Original version before PII redaction.\n" +
                      "Redacted on: " + new Date().toISOString() + "\n" +
                      "PII types found: " + piiFound.map(p => p.type).join(", ");
  backup.setDescription(description);
  
  console.log("  ✓ Original stored: " + backupName);
}

/**
 * Categorizes evidence claims with color highlighting
 */
function categorizeEvidence(doc, body, text, stats) {
  const paragraphs = body.getParagraphs();
  let claimsCategorized = 0;
  
  paragraphs.forEach(para => {
    const paraText = para.getText().toLowerCase();
    if (paraText.length < 20) return; // Skip short paragraphs
    
    // Determine evidence level
    const level = determineEvidenceLevel(paraText);
    
    if (level) {
      // Apply background color based on evidence level
      para.setBackgroundColor(CONFIG.EVIDENCE_COLORS[level]);
      claimsCategorized++;
    }
  });
  
  stats.claimsCategorized += claimsCategorized;
  return { categorized: claimsCategorized };
}

/**
 * Determines the evidence level of a text passage
 */
function determineEvidenceLevel(text) {
  // Check from most rigorous to least
  for (const marker of CONFIG.EVIDENCE_MARKERS.VERIFIED) {
    if (text.includes(marker.toLowerCase())) return "VERIFIED";
  }
  for (const marker of CONFIG.EVIDENCE_MARKERS.SUPPORTED) {
    if (text.includes(marker.toLowerCase())) return "SUPPORTED";
  }
  for (const marker of CONFIG.EVIDENCE_MARKERS.THEORETICAL) {
    if (text.includes(marker.toLowerCase())) return "THEORETICAL";
  }
  for (const marker of CONFIG.EVIDENCE_MARKERS.SPECULATIVE) {
    if (text.includes(marker.toLowerCase())) return "SPECULATIVE";
  }
  
  return null; // No evidence markers found
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE SHEETS PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes a Google Sheet for PII
 */
function processGoogleSheet(file, stats) {
  const sheet = SpreadsheetApp.openById(file.getId());
  const sheets = sheet.getSheets();
  
  sheets.forEach(s => {
    const range = s.getDataRange();
    const values = range.getValues();
    let modified = false;
    
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        const cell = String(values[i][j]);
        
        for (const [type, pattern] of Object.entries(CONFIG.PII_PATTERNS)) {
          if (pattern.test(cell)) {
            // Store original first time
            if (!modified) {
              storeOriginalVersion(file, [{ type: type, value: "spreadsheet data" }]);
              modified = true;
            }
            
            // Redact
            values[i][j] = cell.replace(pattern, generateRedactionPlaceholder(type, ""));
            stats.piiRedacted++;
          }
        }
      }
    }
    
    if (modified) {
      range.setValues(values);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE SLIDES PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes Google Slides for PII
 */
function processGoogleSlides(file, stats) {
  const presentation = SlidesApp.openById(file.getId());
  const slides = presentation.getSlides();
  let modified = false;
  
  slides.forEach(slide => {
    const shapes = slide.getShapes();
    shapes.forEach(shape => {
      if (shape.getText) {
        const textRange = shape.getText();
        const text = textRange.asString();
        
        for (const [type, pattern] of Object.entries(CONFIG.PII_PATTERNS)) {
          if (pattern.test(text)) {
            if (!modified) {
              storeOriginalVersion(file, [{ type: type, value: "presentation data" }]);
              modified = true;
            }
            
            textRange.replaceAllText(text.match(pattern)[0], generateRedactionPlaceholder(type, ""));
            stats.piiRedacted++;
          }
        }
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE ORGANIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Categorizes a file based on its content and name
 */
function categorizeFile(file) {
  const fileName = file.getName().toLowerCase();
  const description = (file.getDescription() || "").toLowerCase();
  
  // Check each category
  for (const [category, keywords] of Object.entries(CONFIG.CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (fileName.includes(keyword) || description.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Try to read content for Google Docs
  if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
    try {
      const doc = DocumentApp.openById(file.getId());
      const text = doc.getBody().getText().toLowerCase().substring(0, 2000); // First 2000 chars
      
      for (const [category, keywords] of Object.entries(CONFIG.CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
          if (text.includes(keyword)) {
            return category;
          }
        }
      }
    } catch (e) {
      // Can't read content, use MISC
    }
  }
  
  return "MISC";
}

/**
 * Determines if a file should be moved to its category folder
 */
function shouldMoveFile(file, currentFolder, category) {
  const targetFolderName = CONFIG.FOLDERS[category];
  const currentFolderName = currentFolder.getName();
  
  // Don't move if already in correct folder
  if (currentFolderName === targetFolderName) {
    return false;
  }
  
  // Don't move from system folders
  if (currentFolderName.startsWith("_")) {
    return false;
  }
  
  return true;
}

/**
 * Moves a file to its category folder
 */
function moveFileToCategory(file, category, stats) {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  
  const targetFolderName = CONFIG.FOLDERS[category];
  const targetFolder = findOrCreateFolder(targetFolderName, rootFolder);
  
  // Move file (add to new folder, remove from old)
  targetFolder.addFile(file);
  
  const parents = file.getParents();
  while (parents.hasNext()) {
    const parent = parents.next();
    if (parent.getId() !== targetFolder.getId()) {
      parent.removeFile(file);
    }
  }
  
  console.log("  → Moved to: " + targetFolderName);
  stats.filesOrganized++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a processing report as a Google Doc
 */
function generateProcessingReport(stats) {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const reportsFolder = findOrCreateFolder(CONFIG.FOLDERS.VALIDATION_REPORTS, rootFolder);
  
  const timestamp = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd_HH-mm");
  const doc = DocumentApp.create("Librarian_Report_" + timestamp);
  const body = doc.getBody();
  
  // Title
  body.appendParagraph("Drive Librarian Processing Report")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  body.appendParagraph("Generated: " + new Date().toISOString());
  body.appendParagraph("");
  
  // Summary
  body.appendParagraph("Summary")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  body.appendParagraph("Files Processed: " + stats.filesProcessed);
  body.appendParagraph("PII Instances Redacted: " + stats.piiRedacted);
  body.appendParagraph("Claims Categorized: " + stats.claimsCategorized);
  body.appendParagraph("Files Organized: " + stats.filesOrganized);
  
  // Errors
  if (stats.errors.length > 0) {
    body.appendParagraph("");
    body.appendParagraph("Errors Encountered")
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    stats.errors.forEach(error => {
      body.appendListItem(error);
    });
  }
  
  // Evidence Legend
  body.appendParagraph("");
  body.appendParagraph("Evidence Level Color Legend")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  const legendTable = body.appendTable();
  const headerRow = legendTable.appendTableRow();
  headerRow.appendTableCell("Level");
  headerRow.appendTableCell("Color");
  headerRow.appendTableCell("Meaning");
  
  const levels = [
    ["VERIFIED", "Green", "Peer-reviewed, replicated, established science"],
    ["SUPPORTED", "Yellow", "Published research, not yet replicated"],
    ["THEORETICAL", "Blue", "Mathematically sound, not empirically tested"],
    ["SPECULATIVE", "Pink", "Hypothesis, preliminary, limited evidence"],
    ["UNVERIFIED", "Gray", "No source found"]
  ];
  
  levels.forEach(([level, color, meaning]) => {
    const row = legendTable.appendTableRow();
    row.appendTableCell(level);
    const colorCell = row.appendTableCell(color);
    colorCell.setBackgroundColor(CONFIG.EVIDENCE_COLORS[level]);
    row.appendTableCell(meaning);
  });
  
  doc.saveAndClose();
  
  // Move report to reports folder
  const docFile = DriveApp.getFileById(doc.getId());
  reportsFolder.addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
  
  console.log("✓ Report generated: " + doc.getName());
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Finds or creates a folder by name
 */
function findOrCreateFolder(name, parentFolder) {
  let folder;
  
  if (parentFolder) {
    const folders = parentFolder.getFoldersByName(name);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = parentFolder.createFolder(name);
    }
  } else {
    // Search in root
    const folders = DriveApp.getFoldersByName(name);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(name);
    }
  }
  
  return folder;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL FUNCTIONS (Run from Script Editor)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Manually restore a redacted file from backup
 * @param {string} originalFileName - Name of the file to restore
 */
function restoreFromBackup(originalFileName) {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const archiveFolder = findOrCreateFolder(CONFIG.FOLDERS.REDACTED_ORIGINALS, rootFolder);
  
  // Find backup files matching the original name
  const files = archiveFolder.getFiles();
  const backups = [];
  
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().includes(originalFileName + "_ORIGINAL_")) {
      backups.push({
        file: file,
        date: file.getLastUpdated()
      });
    }
  }
  
  if (backups.length === 0) {
    console.log("No backups found for: " + originalFileName);
    return;
  }
  
  // Sort by date, most recent first
  backups.sort((a, b) => b.date - a.date);
  
  console.log("Found " + backups.length + " backup(s) for: " + originalFileName);
  backups.forEach((b, i) => {
    console.log("  " + (i + 1) + ". " + b.file.getName() + " (" + b.date.toISOString() + ")");
  });
  
  // Restore most recent
  const latest = backups[0].file;
  const restored = latest.makeCopy(originalFileName + "_RESTORED", rootFolder);
  console.log("✓ Restored: " + restored.getName());
}

/**
 * List all backed-up originals
 */
function listBackups() {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const archiveFolder = findOrCreateFolder(CONFIG.FOLDERS.REDACTED_ORIGINALS, rootFolder);
  
  const files = archiveFolder.getFiles();
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("BACKED-UP ORIGINALS (before PII redaction)");
  console.log("═══════════════════════════════════════════════════════════════");
  
  let count = 0;
  while (files.hasNext()) {
    const file = files.next();
    console.log(file.getName());
    console.log("  Description: " + (file.getDescription() || "None"));
    console.log("  Date: " + file.getLastUpdated().toISOString());
    console.log("");
    count++;
  }
  
  console.log("Total backups: " + count);
}

/**
 * Reset all evidence highlighting (removes background colors)
 */
function resetEvidenceHighlighting() {
  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  
  processAllDocs(rootFolder, (doc) => {
    const body = doc.getBody();
    const paragraphs = body.getParagraphs();
    paragraphs.forEach(para => {
      para.setBackgroundColor(null);
    });
  });
  
  console.log("✓ Evidence highlighting reset");
}

/**
 * Helper to process all docs in a folder
 */
function processAllDocs(folder, callback) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
      const doc = DocumentApp.openById(file.getId());
      callback(doc);
      doc.saveAndClose();
    }
  }
  
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    if (!subfolder.getName().startsWith("_")) {
      processAllDocs(subfolder, callback);
    }
  }
}
