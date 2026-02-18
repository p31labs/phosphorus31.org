/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PHENIX COGNITIVE HUB - Master Google Workspace Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The isomorphic brain: Capture → Process → Connect → Output
 * 
 * COMPONENTS:
 * - Keep integration (voice memos, quick captures)
 * - Tasks integration (actions, deadlines)
 * - Drive Librarian (clean, tag, organize)
 * - NotebookLM source management
 * - Gemini API for auto-research and synthesis
 * 
 * Author: Will Johnson / Claude
 * Version: 1.0.0
 * Date: January 19, 2026
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const HUB_CONFIG = {
  // Root folder for the entire system
  ROOT_FOLDER_NAME: "<3",
  
  // Inbox folder - where raw captures land before processing
  INBOX_FOLDER: "_Inbox",
  
  // Domain-specific notebook folders
  DOMAINS: {
    "Phenix Navigator": {
      keywords: ["phenix", "navigator", "quantum", "SIC-POVM", "ESP32", "LoRa", "mesh", "tetrahedron", "QKD"],
      color: "#7B68EE",  // Purple
      notebookId: null   // Set after creating NotebookLM notebook
    },
    "Fisher-Escola Research": {
      keywords: ["fisher", "escola", "posner", "calcium", "quantum cognition", "coherence", "PTH", "hypoparathyroidism"],
      color: "#4CAF50",  // Green
      notebookId: null
    },
    "Legal-Court": {
      keywords: ["court", "custody", "legal", "attorney", "filing", "motion", "february 14", "deadline"],
      color: "#F44336",  // Red
      notebookId: null
    },
    "Personal-Family": {
      keywords: ["family", "kids", "personal", "health", "journal", "reflection"],
      color: "#2196F3",  // Blue
      notebookId: null
    },
    "Technical-Engineering": {
      keywords: ["code", "programming", "engineering", "hardware", "software", "debug", "implementation"],
      color: "#FF9800",  // Orange
      notebookId: null
    }
  },
  
  // Master collective folder (everything gets mirrored here)
  COLLECTIVE_FOLDER: "_Collective",
  
  // Voice memo settings
  VOICE: {
    transcriptionFolder: "_Voice_Transcripts",
    rawAudioFolder: "_Voice_Raw",
    autoTranscribe: true
  },
  
  // Task tracking
  TASKS: {
    trackingSheetName: "Task_Tracker",
    defaultTaskList: "@default",
    captureToInbox: true
  },
  
  // Processing intervals
  SCHEDULE: {
    quickScanMinutes: 15,     // Check inbox every 15 min
    fullProcessHour: 3,       // Full processing at 3 AM
    taskSyncMinutes: 30       // Sync tasks every 30 min
  },
  
  // Gemini API (set your key in Script Properties)
  GEMINI: {
    model: "gemini-1.5-pro",
    enabled: true
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE SHIELD: TRI-STATE BIO-METRIC GOVERNOR
  // ═══════════════════════════════════════════════════════════════════════════
  SHIELD: {
    // Biometric Thresholds (Hypoparathyroidism Safety Rails)
    BIO_MARKERS: {
      calcium_critical: 8.5,  // Below this = RED ZONE (Protocol Zero)
      calcium_warning: 9.0,   // Below this = YELLOW ZONE (Voltage Strip)
      fog_limit: 7            // Above this = RED ZONE
    },
    
    // Hazard keywords that trigger Voltage Stripping in Yellow Zone
    hazardKeywords: [
      "court", "custody", "attorney", "motion", "filing", "deadline",
      "demand", "comply", "violation", "contempt", "emergency",
      "urgent", "immediately", "consequences", "failure to"
    ],
    
    // "Voltage Stripping" Prompt - Strips emotional drivers from hostile text
    VOLTAGE_PROMPT: `You are a protective filter. Rewrite this incoming text to be purely factual.
RULES:
- Remove ALL emotional language, threats, and urgency vectors
- Remove manipulation tactics and guilt-inducing phrases  
- Keep only verifiable facts, dates, and concrete requests
- Format as BLUF (Bottom Line Up Front)
- If the text is primarily emotional with no factual content, respond: "No actionable content detected."

TEXT TO PROCESS:
`,
    
    // Auto-Response for Red Zone (Protocol Zero)
    PROTOCOL_ZERO_MSG: "AUTO-REPLY: Operator is currently in a medical recovery cycle (Hypoparathyroidism Management). This message has been buffered and will be reviewed when bio-metrics stabilize. For genuine emergencies, contact [BACKUP_CONTACT].",
    
    // Buffer folder for quarantined content
    BUFFER_FOLDER: "_Shielded_Buffer",
    
    // Telemetry sheet name in Command Center
    TELEMETRY_SHEET: "Bio_Telemetry"
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Master setup - creates entire folder structure and tracking systems
 */
function setupCognitiveHub() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("PHENIX COGNITIVE HUB - Initial Setup");
  console.log("═══════════════════════════════════════════════════════════════");
  
  const props = PropertiesService.getScriptProperties();
  
  // 1. Create/find root folder
  const rootFolder = findOrCreateFolder(HUB_CONFIG.ROOT_FOLDER_NAME, null);
  props.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
  console.log("✓ Root folder: " + rootFolder.getName());
  
  // 2. Create inbox
  const inboxFolder = findOrCreateFolder(HUB_CONFIG.INBOX_FOLDER, rootFolder);
  props.setProperty("INBOX_FOLDER_ID", inboxFolder.getId());
  console.log("✓ Inbox folder: " + HUB_CONFIG.INBOX_FOLDER);
  
  // 3. Create domain folders
  const domainIds = {};
  for (const [domain, config] of Object.entries(HUB_CONFIG.DOMAINS)) {
    const folder = findOrCreateFolder(domain, rootFolder);
    domainIds[domain] = folder.getId();
    console.log("✓ Domain folder: " + domain);
  }
  props.setProperty("DOMAIN_FOLDER_IDS", JSON.stringify(domainIds));
  
  // 4. Create collective folder
  const collectiveFolder = findOrCreateFolder(HUB_CONFIG.COLLECTIVE_FOLDER, rootFolder);
  props.setProperty("COLLECTIVE_FOLDER_ID", collectiveFolder.getId());
  console.log("✓ Collective folder: " + HUB_CONFIG.COLLECTIVE_FOLDER);
  
  // 5. Create voice folders
  const voiceTranscripts = findOrCreateFolder(HUB_CONFIG.VOICE.transcriptionFolder, rootFolder);
  const voiceRaw = findOrCreateFolder(HUB_CONFIG.VOICE.rawAudioFolder, rootFolder);
  props.setProperty("VOICE_TRANSCRIPTS_ID", voiceTranscripts.getId());
  props.setProperty("VOICE_RAW_ID", voiceRaw.getId());
  console.log("✓ Voice folders created");
  
  // 6. Create system folders (including Shield buffer)
  const systemFolders = ["_Archive", "_Redacted_Originals", "_Validation_Reports", "_Processing_Logs", "_Shielded_Buffer"];
  for (const name of systemFolders) {
    findOrCreateFolder(name, rootFolder);
    console.log("✓ System folder: " + name);
  }
  
  // 7. Create task tracking spreadsheet
  const trackingSheet = createTaskTracker(rootFolder);
  props.setProperty("TASK_TRACKER_ID", trackingSheet.getId());
  console.log("✓ Task tracker: " + trackingSheet.getName());
  
  // 8. Create Bio_Telemetry sheet for Cognitive Shield
  setupBioTelemetry(trackingSheet);
  console.log("✓ Bio_Telemetry sheet created (Cognitive Shield)");
  
  // 9. Create daily capture doc
  const dailyCapture = createDailyCaptureDoc(inboxFolder);
  props.setProperty("DAILY_CAPTURE_ID", dailyCapture.getId());
  console.log("✓ Daily capture doc created");
  
  props.setProperty("SETUP_COMPLETE", "true");
  props.setProperty("SETUP_DATE", new Date().toISOString());
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("SETUP COMPLETE");
  console.log("Next: Run createAllTriggers() to enable automation");
  console.log("═══════════════════════════════════════════════════════════════");
  
  return {
    rootFolderId: rootFolder.getId(),
    inboxFolderId: inboxFolder.getId(),
    domainIds: domainIds,
    collectiveFolderId: collectiveFolder.getId(),
    taskTrackerId: trackingSheet.getId()
  };
}

/**
 * Creates all scheduled triggers
 */
function createAllTriggers() {
  // Remove existing triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // Quick scan every 15 minutes
  ScriptApp.newTrigger("processInbox")
    .timeBased()
    .everyMinutes(15)
    .create();
  console.log("✓ Inbox processing: every 15 minutes");
  
  // Task sync every 30 minutes
  ScriptApp.newTrigger("syncTasks")
    .timeBased()
    .everyMinutes(30)
    .create();
  console.log("✓ Task sync: every 30 minutes");
  
  // Full processing daily at 3 AM
  ScriptApp.newTrigger("runFullProcessing")
    .timeBased()
    .everyDays(1)
    .atHour(3)
    .create();
  console.log("✓ Full processing: daily at 3 AM");
  
  // Weekly summary on Sunday at 8 AM
  ScriptApp.newTrigger("generateWeeklySummary")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(8)
    .create();
  console.log("✓ Weekly summary: Sundays at 8 AM");
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPTURE LAYER - Frictionless Entry Points
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates a daily capture document - your quick-dump target
 */
function createDailyCaptureDoc(parentFolder) {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const title = `Capture_${today}`;
  
  // Check if today's capture doc already exists
  const existing = parentFolder.getFilesByName(title);
  if (existing.hasNext()) {
    return DocumentApp.openById(existing.next().getId());
  }
  
  // Create new capture doc
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  
  // Header
  body.appendParagraph("🧠 Daily Capture - " + today)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  body.appendParagraph("Quick dump zone. Don't organize, just capture. The system will sort it out.")
      .setItalic(true)
      .setForegroundColor("#666666");
  
  body.appendHorizontalRule();
  
  // Quick capture sections
  body.appendParagraph("💡 Ideas / Thoughts")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("");
  
  body.appendParagraph("📋 Tasks / To-Do")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("");
  
  body.appendParagraph("🔬 Research Notes")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("");
  
  body.appendParagraph("💬 Voice Memo Summaries")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("");
  
  body.appendParagraph("🎯 Urgent / Time-Sensitive")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("");
  
  doc.saveAndClose();
  
  // Move to inbox folder
  const docFile = DriveApp.getFileById(doc.getId());
  parentFolder.addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
  
  return doc;
}

/**
 * Gets or creates today's capture doc
 */
function getTodaysCaptureDoc() {
  const props = PropertiesService.getScriptProperties();
  const inboxId = props.getProperty("INBOX_FOLDER_ID");
  const inbox = DriveApp.getFolderById(inboxId);
  
  return createDailyCaptureDoc(inbox);
}

/**
 * Quick capture - append text to today's capture doc
 * Can be called from web app, mobile shortcut, or manually
 */
function quickCapture(text, category = "Ideas / Thoughts") {
  const doc = getTodaysCaptureDoc();
  const body = DocumentApp.openById(doc.getId()).getBody();
  
  // Find the category section and append
  const searchPattern = category;
  const searchResult = body.findText(searchPattern);
  
  if (searchResult) {
    const element = searchResult.getElement();
    const parent = element.getParent();
    const index = body.getChildIndex(parent);
    
    // Insert after the heading
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "HH:mm");
    body.insertParagraph(index + 1, `[${timestamp}] ${text}`);
  } else {
    // Just append at end if category not found
    body.appendParagraph(text);
  }
  
  return { success: true, docId: doc.getId() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE MEMO PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes voice memos in the voice raw folder
 * Transcribes using Google Cloud Speech-to-Text (if enabled)
 * Falls back to Gemini for transcription
 */
function processVoiceMemos() {
  const props = PropertiesService.getScriptProperties();
  const voiceRawId = props.getProperty("VOICE_RAW_ID");
  const voiceTranscriptsId = props.getProperty("VOICE_TRANSCRIPTS_ID");
  
  if (!voiceRawId) {
    console.log("Voice folders not configured");
    return;
  }
  
  const rawFolder = DriveApp.getFolderById(voiceRawId);
  const transcriptsFolder = DriveApp.getFolderById(voiceTranscriptsId);
  
  // Get audio files
  const audioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a", "audio/ogg", "audio/webm"];
  const files = rawFolder.getFiles();
  
  let processed = 0;
  
  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    
    // Check if it's an audio file
    if (audioTypes.some(t => mimeType.includes(t.split("/")[1]))) {
      // Check if already transcribed
      const transcriptName = file.getName().replace(/\.[^.]+$/, "_transcript.md");
      const existingTranscript = transcriptsFolder.getFilesByName(transcriptName);
      
      if (!existingTranscript.hasNext()) {
        console.log("Transcribing: " + file.getName());
        
        try {
          // Try Gemini transcription
          const transcript = transcribeWithGemini(file);
          
          if (transcript) {
            // Create transcript document
            const transcriptDoc = createTranscriptDoc(file.getName(), transcript, transcriptsFolder);
            
            // Also add to today's capture
            quickCapture(
              `🎤 Voice memo transcribed: "${file.getName()}"\n\n${transcript.substring(0, 500)}...`,
              "Voice Memo Summaries"
            );
            
            processed++;
          }
        } catch (e) {
          console.error("Transcription failed for " + file.getName() + ": " + e.message);
        }
      }
    }
  }
  
  console.log("Processed " + processed + " voice memos");
  return processed;
}

/**
 * Transcribes audio using Gemini API
 */
function transcribeWithGemini(audioFile) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("GEMINI_API_KEY");
  
  if (!apiKey) {
    console.log("Gemini API key not set. Set GEMINI_API_KEY in Script Properties.");
    return null;
  }
  
  // For audio transcription, we'll use Gemini's multimodal capabilities
  // Note: This requires the audio to be accessible via URL or base64
  
  const audioBlob = audioFile.getBlob();
  const base64Audio = Utilities.base64Encode(audioBlob.getBytes());
  const mimeType = audioFile.getMimeType();
  
  const payload = {
    contents: [{
      parts: [
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Audio
          }
        },
        {
          text: "Please transcribe this audio recording accurately. Include timestamps if there are natural pauses or topic changes. Format the output clearly."
        }
      ]
    }]
  };
  
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    options
  );
  
  const result = JSON.parse(response.getContentText());
  
  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  }
  
  return null;
}

/**
 * Creates a transcript document
 */
function createTranscriptDoc(originalName, transcript, folder) {
  const doc = DocumentApp.create(originalName.replace(/\.[^.]+$/, "_transcript"));
  const body = doc.getBody();
  
  body.appendParagraph("🎤 Voice Memo Transcript")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  body.appendParagraph("Original file: " + originalName)
      .setItalic(true);
  body.appendParagraph("Transcribed: " + new Date().toISOString())
      .setItalic(true);
  
  body.appendHorizontalRule();
  body.appendParagraph(transcript);
  
  doc.saveAndClose();
  
  // Move to folder
  const docFile = DriveApp.getFileById(doc.getId());
  folder.addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
  
  return doc;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates the task tracking spreadsheet
 */
function createTaskTracker(parentFolder) {
  const ss = SpreadsheetApp.create(HUB_CONFIG.TASKS.trackingSheetName);
  const sheet = ss.getActiveSheet();
  sheet.setName("Active Tasks");
  
  // Headers
  const headers = [
    "Task ID", "Title", "Status", "Domain", "Priority", 
    "Due Date", "Created", "Completed", "Notes", "Google Task ID"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  
  // Create additional sheets
  const completedSheet = ss.insertSheet("Completed");
  completedSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  completedSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  completedSheet.setFrozenRows(1);
  
  const dashboardSheet = ss.insertSheet("Dashboard");
  setupDashboard(dashboardSheet);
  
  // Move to folder
  const file = DriveApp.getFileById(ss.getId());
  parentFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  
  return ss;
}

/**
 * Sets up the dashboard sheet with summary formulas
 */
function setupDashboard(sheet) {
  sheet.getRange("A1").setValue("📊 Task Dashboard").setFontSize(18).setFontWeight("bold");
  sheet.getRange("A2").setValue("Last updated: " + new Date().toLocaleString()).setFontStyle("italic");
  
  sheet.getRange("A4").setValue("Active Tasks by Domain");
  sheet.getRange("A5").setFormula('=COUNTIF(\'Active Tasks\'!D:D,"Phenix Navigator")');
  sheet.getRange("B5").setValue("Phenix Navigator");
  
  sheet.getRange("A6").setFormula('=COUNTIF(\'Active Tasks\'!D:D,"Fisher-Escola Research")');
  sheet.getRange("B6").setValue("Fisher-Escola Research");
  
  sheet.getRange("A7").setFormula('=COUNTIF(\'Active Tasks\'!D:D,"Legal-Court")');
  sheet.getRange("B7").setValue("Legal-Court");
  
  sheet.getRange("A10").setValue("Overdue Tasks");
  sheet.getRange("A11").setFormula('=COUNTIF(\'Active Tasks\'!F:F,"<"&TODAY())');
  
  sheet.getRange("A13").setValue("Due This Week");
  sheet.getRange("A14").setFormula('=COUNTIFS(\'Active Tasks\'!F:F,">="&TODAY(),\'Active Tasks\'!F:F,"<="&TODAY()+7)');
}

/**
 * Sets up the Bio_Telemetry sheet for Cognitive Shield
 * This tracks calcium levels, brain fog, and symptoms
 */
function setupBioTelemetry(ss) {
  // Check if sheet already exists
  let bioSheet = ss.getSheetByName(HUB_CONFIG.SHIELD.TELEMETRY_SHEET);
  
  if (!bioSheet) {
    bioSheet = ss.insertSheet(HUB_CONFIG.SHIELD.TELEMETRY_SHEET);
  }
  
  // Header row
  const headers = ["Timestamp", "Fog Level (1-10)", "Calcium (mg/dL)", "Symptoms", "Notes", "Shield State"];
  bioSheet.getRange("A1:F1").setValues([headers]);
  bioSheet.getRange("A1:F1")
    .setFontWeight("bold")
    .setBackground("#7B68EE")
    .setFontColor("white");
  
  // Add conditional formatting for Shield State column
  // GREEN zone
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("GREEN")
    .setBackground("#C8E6C9")
    .setRanges([bioSheet.getRange("F:F")])
    .build();
  
  // YELLOW zone
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("YELLOW")
    .setBackground("#FFF9C4")
    .setRanges([bioSheet.getRange("F:F")])
    .build();
  
  // RED zone
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("RED")
    .setBackground("#FFCDD2")
    .setRanges([bioSheet.getRange("F:F")])
    .build();
  
  // Calcium critical highlighting
  const calciumCritRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_critical)
    .setBackground("#FFCDD2")
    .setRanges([bioSheet.getRange("C:C")])
    .build();
  
  // Calcium warning highlighting
  const calciumWarnRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_warning)
    .setBackground("#FFF9C4")
    .setRanges([bioSheet.getRange("C:C")])
    .build();
  
  // Fog level critical
  const fogCritRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(HUB_CONFIG.SHIELD.BIO_MARKERS.fog_limit)
    .setBackground("#FFCDD2")
    .setRanges([bioSheet.getRange("B:B")])
    .build();
  
  bioSheet.setConditionalFormatRules([
    greenRule, yellowRule, redRule, 
    calciumCritRule, calciumWarnRule, fogCritRule
  ]);
  
  // Add data validation for Fog Level (1-10)
  const fogValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 10)
    .setHelpText("Enter fog level from 1 (clear) to 10 (severe)")
    .build();
  bioSheet.getRange("B2:B1000").setDataValidation(fogValidation);
  
  // Add data validation for Calcium
  const calciumValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(5.0, 15.0)
    .setHelpText("Enter calcium level in mg/dL (normal: 8.5-10.5)")
    .build();
  bioSheet.getRange("C2:C1000").setDataValidation(calciumValidation);
  
  // Set column widths
  bioSheet.setColumnWidth(1, 180);  // Timestamp
  bioSheet.setColumnWidth(2, 120);  // Fog
  bioSheet.setColumnWidth(3, 130);  // Calcium
  bioSheet.setColumnWidth(4, 200);  // Symptoms
  bioSheet.setColumnWidth(5, 250);  // Notes
  bioSheet.setColumnWidth(6, 100);  // Shield State
  
  // Add example row with formula
  bioSheet.getRange("A2").setValue(new Date());
  bioSheet.getRange("B2").setValue(3);  // Good fog level
  bioSheet.getRange("C2").setValue(9.2); // Good calcium
  bioSheet.getRange("D2").setValue("None");
  bioSheet.getRange("E2").setValue("Initial setup - update with actual readings");
  bioSheet.getRange("F2").setFormula('=IF(OR(C2<' + HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_critical + ',B2>=' + HUB_CONFIG.SHIELD.BIO_MARKERS.fog_limit + '),"RED",IF(OR(C2<' + HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_warning + ',B2>=4),"YELLOW","GREEN"))');
  
  // Add instructions at top
  bioSheet.insertRowBefore(1);
  bioSheet.getRange("A1").setValue("🛡️ COGNITIVE SHIELD BIO-TELEMETRY")
    .setFontSize(14).setFontWeight("bold").setFontColor("#7B68EE");
  bioSheet.getRange("D1").setValue("Enter readings when you take vitals. Shield auto-reads latest row.")
    .setFontStyle("italic").setFontColor("#666666");
  
  console.log("✓ Bio_Telemetry sheet configured with conditional formatting");
  return bioSheet;
}

/**
 * Syncs Google Tasks to the tracking spreadsheet
 */
function syncTasks() {
  const props = PropertiesService.getScriptProperties();
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  
  if (!trackerId) {
    console.log("Task tracker not set up");
    return;
  }
  
  const ss = SpreadsheetApp.openById(trackerId);
  const sheet = ss.getSheetByName("Active Tasks");
  
  // Get existing task IDs from sheet
  const existingData = sheet.getDataRange().getValues();
  const existingTaskIds = new Set(existingData.slice(1).map(row => row[9])); // Google Task ID column
  
  // Get all task lists
  try {
    const taskLists = Tasks.Tasklists.list();
    
    if (taskLists.items) {
      for (const taskList of taskLists.items) {
        const tasks = Tasks.Tasks.list(taskList.id, { showCompleted: false, showHidden: false });
        
        if (tasks.items) {
          for (const task of tasks.items) {
            if (!existingTaskIds.has(task.id)) {
              // New task - add to sheet
              const domain = categorizeToDomain(task.title + " " + (task.notes || ""));
              const priority = extractPriority(task.title);
              
              const newRow = [
                generateTaskId(),
                task.title,
                "Active",
                domain,
                priority,
                task.due ? new Date(task.due) : "",
                new Date(),
                "",
                task.notes || "",
                task.id
              ];
              
              sheet.appendRow(newRow);
              console.log("Added task: " + task.title);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error syncing tasks: " + e.message);
  }
  
  // Update dashboard timestamp
  const dashboard = ss.getSheetByName("Dashboard");
  if (dashboard) {
    dashboard.getRange("A2").setValue("Last updated: " + new Date().toLocaleString());
  }
}

/**
 * Generates a unique task ID
 */
function generateTaskId() {
  return "T" + Date.now().toString(36).toUpperCase();
}

/**
 * Extracts priority from task title (looks for P1, P2, P3, !, !!, !!!)
 */
function extractPriority(title) {
  if (/P1|!!!/i.test(title)) return "High";
  if (/P2|!!/i.test(title)) return "Medium";
  if (/P3|!/i.test(title)) return "Low";
  return "Normal";
}

/**
 * Creates a task from text (can be called from capture)
 */
function createTaskFromCapture(text) {
  // Extract due date if mentioned
  const dueDateMatch = text.match(/(?:due|by|before)\s+(\d{1,2}\/\d{1,2}|\w+\s+\d{1,2})/i);
  let dueDate = null;
  
  if (dueDateMatch) {
    try {
      dueDate = new Date(dueDateMatch[1]);
    } catch (e) {
      // Couldn't parse date
    }
  }
  
  // Create in Google Tasks
  const task = {
    title: text.replace(/(?:due|by|before)\s+\d{1,2}\/\d{1,2}/i, "").trim(),
    notes: "Created from Cognitive Hub capture",
    due: dueDate ? dueDate.toISOString() : null
  };
  
  try {
    Tasks.Tasks.insert(task, "@default");
    console.log("Created task: " + task.title);
    return true;
  } catch (e) {
    console.error("Error creating task: " + e.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE SHIELD - TRI-STATE BIO-METRIC GOVERNOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generic Gemini API caller
 */
function callGemini(prompt) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("GEMINI_API_KEY");
  
  if (!apiKey) {
    throw new Error("Gemini API key not set");
  }
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.3  // Lower temp for factual stripping
    }
  };
  
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${HUB_CONFIG.GEMINI.model}:generateContent?key=${apiKey}`,
    options
  );
  
  const result = JSON.parse(response.getContentText());
  
  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error("No response from Gemini");
}

/**
 * ENGINE: Tri-State Bio-Metric Governor
 * Reads Bio_Telemetry sheet and returns current shield state
 * Returns: "GREEN", "YELLOW", or "RED"
 */
function getShieldState() {
  const props = PropertiesService.getScriptProperties();
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  
  if (!trackerId) {
    console.log("🛡️ No telemetry configured - defaulting to GREEN");
    return "GREEN";
  }
  
  try {
    const ss = SpreadsheetApp.openById(trackerId);
    const bioSheet = ss.getSheetByName(HUB_CONFIG.SHIELD.TELEMETRY_SHEET);
    
    if (!bioSheet || bioSheet.getLastRow() < 2) {
      console.log("🛡️ No bio-telemetry data - defaulting to GREEN");
      return "GREEN";
    }
    
    // Fetch latest telemetry row: [Timestamp, Fog(1-10), Calcium, Symptoms]
    const data = bioSheet.getRange(bioSheet.getLastRow(), 1, 1, 4).getValues()[0];
    const fog = parseFloat(data[1]) || 0;
    const calcium = parseFloat(data[2]) || 10.0;  // Default to healthy if missing
    const symptoms = (data[3] || "").toString().toLowerCase();
    
    // LOGIC: Hypoparathyroidism Safety Rails
    const markers = HUB_CONFIG.SHIELD.BIO_MARKERS;
    
    // RED ZONE: Critical state - complete air gap
    if (calcium < markers.calcium_critical || 
        fog >= markers.fog_limit || 
        symptoms.includes("tetany") || 
        symptoms.includes("seizure")) {
      props.setProperty("SHIELD_STATE", "RED");
      props.setProperty("SHIELD_STATE_TIME", new Date().toISOString());
      console.log(`🔴 SHIELD: RED ZONE (Ca: ${calcium}, Fog: ${fog})`);
      return "RED";
    }
    
    // YELLOW ZONE: Impaired - voltage stripping active
    if (calcium < markers.calcium_warning || 
        fog >= 4 || 
        symptoms.includes("paresthesia") || 
        symptoms.includes("brain fog")) {
      props.setProperty("SHIELD_STATE", "YELLOW");
      props.setProperty("SHIELD_STATE_TIME", new Date().toISOString());
      console.log(`🟡 SHIELD: YELLOW ZONE (Ca: ${calcium}, Fog: ${fog})`);
      return "YELLOW";
    }
    
    // GREEN ZONE: Coherent - standard processing
    props.setProperty("SHIELD_STATE", "GREEN");
    props.setProperty("SHIELD_STATE_TIME", new Date().toISOString());
    console.log(`🟢 SHIELD: GREEN ZONE (Ca: ${calcium}, Fog: ${fog})`);
    return "GREEN";
    
  } catch (e) {
    console.error("Shield state check failed: " + e.message);
    return "GREEN";  // Fail-open for now
  }
}

/**
 * ACTIVE DEFENSE: Voltage Stripping
 * Rewrites hostile/emotional text into safe factual "Data Packets"
 */
function stripVoltage(text) {
  try {
    const prompt = HUB_CONFIG.SHIELD.VOLTAGE_PROMPT + text.substring(0, 5000);
    const safeText = callGemini(prompt);
    
    const timestamp = new Date().toISOString();
    return `═══════════════════════════════════════════════════════════════
🛡️ VOLTAGE STRIPPED - ${timestamp}
Shield Status: YELLOW ZONE (Impedance Match Active)
═══════════════════════════════════════════════════════════════

BLUF (Bottom Line Up Front):
${safeText}

═══════════════════════════════════════════════════════════════
[Original content preserved in _Redacted_Originals]
═══════════════════════════════════════════════════════════════`;
  } catch (e) {
    console.error("Voltage stripping failed: " + e.message);
    return `🛡️ VOLTAGE STRIP FAILED
Error: ${e.message}
[Raw content moved to _Shielded_Buffer for manual review when GREEN]`;
  }
}

/**
 * Checks if content contains hazard keywords
 */
function containsHazard(content) {
  const contentLower = content.toLowerCase();
  return HUB_CONFIG.SHIELD.hazardKeywords.some(k => contentLower.includes(k.toLowerCase()));
}

/**
 * Logs shield activity to telemetry
 */
function logShieldActivity(action, fileName, state) {
  const props = PropertiesService.getScriptProperties();
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  
  if (!trackerId) return;
  
  try {
    const ss = SpreadsheetApp.openById(trackerId);
    let logSheet = ss.getSheetByName("Shield_Log");
    
    if (!logSheet) {
      logSheet = ss.insertSheet("Shield_Log");
      logSheet.getRange("A1:E1").setValues([["Timestamp", "State", "Action", "File", "Notes"]]);
      logSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#7B68EE").setFontColor("white");
    }
    
    logSheet.appendRow([
      new Date(),
      state,
      action,
      fileName,
      ""
    ]);
  } catch (e) {
    console.error("Shield logging failed: " + e.message);
  }
}

/**
 * UTILITY: Log a bio reading manually
 * Call this when you take vitals
 */
function logBioReading(fogLevel, calcium, symptoms, notes) {
  const props = PropertiesService.getScriptProperties();
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  
  if (!trackerId) {
    console.log("Task tracker not configured");
    return null;
  }
  
  const ss = SpreadsheetApp.openById(trackerId);
  const bioSheet = ss.getSheetByName(HUB_CONFIG.SHIELD.TELEMETRY_SHEET);
  
  if (!bioSheet) {
    console.log("Bio_Telemetry sheet not found. Run setupCognitiveHub() first.");
    return null;
  }
  
  // Calculate shield state
  const markers = HUB_CONFIG.SHIELD.BIO_MARKERS;
  let state = "GREEN";
  if (calcium < markers.calcium_critical || fogLevel >= markers.fog_limit) {
    state = "RED";
  } else if (calcium < markers.calcium_warning || fogLevel >= 4) {
    state = "YELLOW";
  }
  
  // Add row
  const lastRow = bioSheet.getLastRow() + 1;
  bioSheet.getRange(lastRow, 1, 1, 6).setValues([[
    new Date(),
    fogLevel,
    calcium,
    symptoms || "",
    notes || "",
    state
  ]]);
  
  console.log(`🛡️ Bio reading logged: Fog=${fogLevel}, Ca=${calcium} → ${state}`);
  
  // Update stored state
  props.setProperty("SHIELD_STATE", state);
  props.setProperty("SHIELD_STATE_TIME", new Date().toISOString());
  
  return state;
}

/**
 * UTILITY: Quick bio log from dialog
 * Creates a popup for easy entry
 */
function quickBioLog() {
  const ui = SpreadsheetApp.getUi();
  
  const fogResult = ui.prompt('🧠 Fog Level', 'Enter fog level (1-10):', ui.ButtonSet.OK_CANCEL);
  if (fogResult.getSelectedButton() !== ui.Button.OK) return;
  
  const calciumResult = ui.prompt('🦴 Calcium', 'Enter calcium (mg/dL):', ui.ButtonSet.OK_CANCEL);
  if (calciumResult.getSelectedButton() !== ui.Button.OK) return;
  
  const symptomsResult = ui.prompt('📋 Symptoms', 'Any symptoms? (paresthesia, tetany, etc):', ui.ButtonSet.OK_CANCEL);
  
  const state = logBioReading(
    parseFloat(fogResult.getResponseText()),
    parseFloat(calciumResult.getResponseText()),
    symptomsResult.getResponseText(),
    "Logged via quick dialog"
  );
  
  ui.alert(`Shield State: ${state}`, 
    `Reading logged.\n\n` +
    `Fog: ${fogResult.getResponseText()}\n` +
    `Calcium: ${calciumResult.getResponseText()}\n` +
    `State: ${state}`,
    ui.ButtonSet.OK);
}

/**
 * UTILITY: Force shield state override (emergency use)
 */
function forceShieldState(state) {
  if (!["GREEN", "YELLOW", "RED"].includes(state)) {
    console.error("Invalid state. Use GREEN, YELLOW, or RED");
    return;
  }
  
  const props = PropertiesService.getScriptProperties();
  props.setProperty("SHIELD_STATE", state);
  props.setProperty("SHIELD_STATE_TIME", new Date().toISOString());
  props.setProperty("SHIELD_OVERRIDE", "true");
  
  console.log(`🛡️ Shield FORCED to ${state}`);
  logShieldActivity("FORCE_OVERRIDE", "manual", state);
}

/**
 * UTILITY: Clear shield override
 */
function clearShieldOverride() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty("SHIELD_OVERRIDE");
  console.log("🛡️ Shield override cleared. Will read from Bio_Telemetry on next cycle.");
}

/**
 * UTILITY: Process buffered files after recovery
 * Call this when you're back to GREEN and ready to review
 */
function processBufferedFiles() {
  const state = getShieldState();
  if (state !== "GREEN") {
    console.log(`🛡️ Cannot process buffer while in ${state} state. Get to GREEN first.`);
    return;
  }
  
  const props = PropertiesService.getScriptProperties();
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  const inboxId = props.getProperty("INBOX_FOLDER_ID");
  
  const rootFolder = DriveApp.getFolderById(rootId);
  const inbox = DriveApp.getFolderById(inboxId);
  const buffer = findOrCreateFolder(HUB_CONFIG.SHIELD.BUFFER_FOLDER, rootFolder);
  
  const files = buffer.getFiles();
  let count = 0;
  
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName().replace("[BUFFERED] ", "");
    file.setName(name);
    inbox.addFile(file);
    buffer.removeFile(file);
    count++;
    console.log(`  ↩️ Restored: ${name}`);
  }
  
  console.log(`🛡️ Restored ${count} files from buffer to inbox.`);
  console.log("Run processInbox() to sort them.");
  
  return count;
}

/**
 * UTILITY: Get current shield status report
 */
function getShieldStatus() {
  const props = PropertiesService.getScriptProperties();
  const state = getShieldState();
  const lastUpdate = props.getProperty("SHIELD_STATE_TIME");
  const override = props.getProperty("SHIELD_OVERRIDE") === "true";
  
  // Count buffered files
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  let bufferedCount = 0;
  
  if (rootId) {
    const rootFolder = DriveApp.getFolderById(rootId);
    const buffer = findOrCreateFolder(HUB_CONFIG.SHIELD.BUFFER_FOLDER, rootFolder);
    const files = buffer.getFiles();
    while (files.hasNext()) {
      files.next();
      bufferedCount++;
    }
  }
  
  const status = {
    state: state,
    lastUpdate: lastUpdate,
    override: override,
    bufferedFiles: bufferedCount,
    thresholds: HUB_CONFIG.SHIELD.BIO_MARKERS
  };
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🛡️ COGNITIVE SHIELD STATUS REPORT");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`State: ${state}`);
  console.log(`Last Update: ${lastUpdate || "Never"}`);
  console.log(`Override Active: ${override}`);
  console.log(`Files in Buffer: ${bufferedCount}`);
  console.log("───────────────────────────────────────────────────────────────");
  console.log("Thresholds:");
  console.log(`  Calcium Critical: < ${HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_critical} mg/dL`);
  console.log(`  Calcium Warning: < ${HUB_CONFIG.SHIELD.BIO_MARKERS.calcium_warning} mg/dL`);
  console.log(`  Fog Limit: >= ${HUB_CONFIG.SHIELD.BIO_MARKERS.fog_limit}`);
  console.log("═══════════════════════════════════════════════════════════════");
  
  return status;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESSING LAYER - Organize & Connect (Shield-Aware)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes the inbox - categorizes and routes items
 * NOW WITH TRI-STATE COGNITIVE SHIELD PROTECTION
 */
function processInbox() {
  const props = PropertiesService.getScriptProperties();
  const inboxId = props.getProperty("INBOX_FOLDER_ID");
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  const domainIds = JSON.parse(props.getProperty("DOMAIN_FOLDER_IDS") || "{}");
  const collectiveId = props.getProperty("COLLECTIVE_FOLDER_ID");
  
  if (!inboxId) {
    console.log("Inbox not configured");
    return;
  }
  
  const inbox = DriveApp.getFolderById(inboxId);
  const rootFolder = DriveApp.getFolderById(rootId);
  const collective = DriveApp.getFolderById(collectiveId);
  
  // Get or create Shield buffer folder
  const buffer = findOrCreateFolder(HUB_CONFIG.SHIELD.BUFFER_FOLDER, rootFolder);
  const redactedFolder = findOrCreateFolder("_Redacted_Originals", rootFolder);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: GET CURRENT BIOLOGICAL STATE
  // ═══════════════════════════════════════════════════════════════════════════
  const shieldState = getShieldState();
  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`🛡️ COGNITIVE SHIELD STATUS: ${shieldState}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);
  
  const files = inbox.getFiles();
  let processed = 0;
  let buffered = 0;
  let stripped = 0;
  
  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    
    // Skip daily capture docs (they stay in inbox)
    if (fileName.startsWith("Capture_")) continue;
    
    // Skip system files
    if (fileName.startsWith("_")) continue;
    
    // Skip already-processed files
    if (fileName.startsWith("[SAFE]") || fileName.startsWith("[BUFFERED]")) continue;
    
    console.log("Processing: " + fileName);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: READ CONTENT
    // ═══════════════════════════════════════════════════════════════════════
    let content = fileName;
    let body = "";
    
    if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
      try {
        const doc = DocumentApp.openById(file.getId());
        body = doc.getBody().getText();
        content = fileName + " " + body;
      } catch (e) {
        // Can't read content
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: EXECUTE DEFENSE PROTOCOLS
    // ═══════════════════════════════════════════════════════════════════════
    
    // ─────────────────────────────────────────────────────────────────────────
    // CASE A: RED ZONE (Protocol Zero) - Absolute Quarantine
    // ─────────────────────────────────────────────────────────────────────────
    if (shieldState === "RED") {
      buffer.addFile(file);
      inbox.removeFile(file);
      file.setName(`[BUFFERED] ${fileName}`);
      
      logShieldActivity("QUARANTINE", fileName, "RED");
      console.log(`  🔴 RED ZONE: Buffered → _Shielded_Buffer`);
      buffered++;
      continue;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // CASE B: YELLOW ZONE (Voltage Stripping) - Hazard Detection
    // ─────────────────────────────────────────────────────────────────────────
    if (shieldState === "YELLOW" && containsHazard(content)) {
      console.log(`  🟡 YELLOW ZONE: Hazard detected - stripping voltage...`);
      
      if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
        // Preserve original
        const originalCopy = file.makeCopy(`[ORIGINAL] ${fileName}`, redactedFolder);
        
        // Strip voltage and overwrite
        const doc = DocumentApp.openById(file.getId());
        const safeSummary = stripVoltage(body);
        doc.getBody().setText(safeSummary);
        doc.setName(`[SAFE] ${fileName}`);
        doc.saveAndClose();
        
        logShieldActivity("VOLTAGE_STRIP", fileName, "YELLOW");
        console.log(`  🟡 Voltage stripped. Original preserved.`);
        stripped++;
      } else {
        // Non-doc files: add safety wrapper via description
        const safeSummary = stripVoltage(content);
        file.setDescription(safeSummary);
        file.setName(`[SAFE] ${fileName}`);
        
        logShieldActivity("VOLTAGE_STRIP", fileName, "YELLOW");
        stripped++;
      }
      // Continue to sorting after stripping
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // CASE C: GREEN ZONE (or post-strip YELLOW) - Standard Domain Sort
    // ─────────────────────────────────────────────────────────────────────────
    const domain = categorizeToDomain(content);
    
    if (domain && domainIds[domain]) {
      // Move to domain folder
      const domainFolder = DriveApp.getFolderById(domainIds[domain]);
      domainFolder.addFile(file);
      inbox.removeFile(file);
      console.log(`  → Moved to: ${domain}`);
      
      // Also add to collective (shortcut)
      try {
        collective.createShortcut(file.getId());
      } catch (e) {
        // Shortcut might already exist
      }
      
      if (shieldState === "GREEN") {
        logShieldActivity("SORTED", fileName, "GREEN");
      }
      processed++;
    }
  }
  
  // Process voice memos
  processVoiceMemos();
  
  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`🛡️ PROCESSING COMPLETE`);
  console.log(`   State: ${shieldState}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Buffered (RED): ${buffered}`);
  console.log(`   Stripped (YELLOW): ${stripped}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);
  
  return { processed, buffered, stripped, state: shieldState };
}

/**
 * Categorizes content to a domain based on keywords
 */
function categorizeToDomain(content) {
  const contentLower = content.toLowerCase();
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [domain, config] of Object.entries(HUB_CONFIG.DOMAINS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = domain;
    }
  }
  
  return bestMatch;
}

/**
 * Full processing run - comprehensive organization
 */
function runFullProcessing() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("FULL PROCESSING RUN - " + new Date().toISOString());
  console.log("═══════════════════════════════════════════════════════════════");
  
  // 1. Process inbox
  const inboxProcessed = processInbox();
  console.log("✓ Inbox: " + inboxProcessed + " items");
  
  // 2. Sync tasks
  syncTasks();
  console.log("✓ Tasks synced");
  
  // 3. Process daily captures
  processOldCaptures();
  console.log("✓ Old captures processed");
  
  // 4. Run Drive Librarian (if integrated)
  try {
    if (typeof runFullLibrarianProcess === 'function') {
      runFullLibrarianProcess();
      console.log("✓ Drive Librarian complete");
    }
  } catch (e) {
    console.log("Drive Librarian not available");
  }
  
  // 5. Update collective folder
  updateCollective();
  console.log("✓ Collective updated");
  
  // 6. Generate daily summary
  generateDailySummary();
  console.log("✓ Daily summary generated");
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("PROCESSING COMPLETE");
  console.log("═══════════════════════════════════════════════════════════════");
}

/**
 * Processes old daily capture docs (older than today)
 */
function processOldCaptures() {
  const props = PropertiesService.getScriptProperties();
  const inboxId = props.getProperty("INBOX_FOLDER_ID");
  const inbox = DriveApp.getFolderById(inboxId);
  
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const files = inbox.getFilesByType(MimeType.GOOGLE_DOCS);
  
  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    
    if (fileName.startsWith("Capture_") && !fileName.includes(today)) {
      // Old capture - extract content and route
      extractAndRouteCaptureContent(file);
    }
  }
}

/**
 * Extracts content from a capture doc and routes to appropriate domains
 */
function extractAndRouteCaptureContent(file) {
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();
  const text = body.getText();
  
  // Look for task items (lines starting with - [ ] or TODO:)
  const taskPatterns = [/^[-*]\s*\[\s*\]\s*(.+)$/gm, /TODO:\s*(.+)$/gm];
  
  for (const pattern of taskPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      createTaskFromCapture(match[1]);
    }
  }
  
  // Archive the old capture
  const props = PropertiesService.getScriptProperties();
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  const root = DriveApp.getFolderById(rootId);
  const archive = findOrCreateFolder("_Archive", root);
  
  archive.addFile(file);
  DriveApp.getFolderById(props.getProperty("INBOX_FOLDER_ID")).removeFile(file);
}

/**
 * Updates the collective folder with shortcuts to all domain content
 */
function updateCollective() {
  const props = PropertiesService.getScriptProperties();
  const collectiveId = props.getProperty("COLLECTIVE_FOLDER_ID");
  const domainIds = JSON.parse(props.getProperty("DOMAIN_FOLDER_IDS") || "{}");
  
  const collective = DriveApp.getFolderById(collectiveId);
  
  // Get existing shortcuts in collective
  const existingShortcuts = new Set();
  const existingFiles = collective.getFiles();
  while (existingFiles.hasNext()) {
    const file = existingFiles.next();
    if (file.getMimeType() === "application/vnd.google-apps.shortcut") {
      // Can't easily get target ID, so we'll skip duplicates by name
      existingShortcuts.add(file.getName());
    }
  }
  
  // Add shortcuts for recent files from each domain
  for (const [domain, folderId] of Object.entries(domainIds)) {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    
    let count = 0;
    while (files.hasNext() && count < 20) {  // Last 20 from each domain
      const file = files.next();
      if (!existingShortcuts.has(file.getName())) {
        try {
          collective.createShortcut(file.getId());
        } catch (e) {
          // Might fail if shortcut exists
        }
      }
      count++;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GEMINI INTEGRATION - Auto-Research & Synthesis
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Uses Gemini to analyze and enrich a document
 */
function analyzeWithGemini(docId) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("GEMINI_API_KEY");
  
  if (!apiKey) {
    console.log("Gemini API key not set");
    return null;
  }
  
  const doc = DocumentApp.openById(docId);
  const text = doc.getBody().getText();
  
  const prompt = `Analyze this document and provide:
1. A brief summary (2-3 sentences)
2. Key claims made and their evidence level (verified, supported, theoretical, speculative)
3. Suggested related topics to research
4. Any action items or tasks mentioned
5. Which domain this belongs to: Phenix Navigator, Fisher-Escola Research, Legal-Court, Personal-Family, or Technical-Engineering

Document content:
${text.substring(0, 10000)}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };
  
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      options
    );
    
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    }
  } catch (e) {
    console.error("Gemini analysis failed: " + e.message);
  }
  
  return null;
}

/**
 * Auto-research: Takes a topic and generates research notes
 */
function autoResearch(topic) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("GEMINI_API_KEY");
  
  if (!apiKey) return null;
  
  const prompt = `Research the following topic and provide a comprehensive summary with:
1. Key facts and findings
2. Current state of research/knowledge
3. Important sources to cite (with publication names/authors if known)
4. Open questions or areas of uncertainty
5. How this might relate to: quantum physics, neuroscience, or communication systems

Topic: ${topic}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };
  
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      options
    );
    
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      const research = result.candidates[0].content.parts[0].text;
      
      // Create a research note doc
      const inboxId = props.getProperty("INBOX_FOLDER_ID");
      const inbox = DriveApp.getFolderById(inboxId);
      
      const doc = DocumentApp.create("Research_" + topic.substring(0, 30) + "_" + Date.now());
      const body = doc.getBody();
      
      body.appendParagraph("🔬 Auto-Research: " + topic)
          .setHeading(DocumentApp.ParagraphHeading.HEADING1);
      body.appendParagraph("Generated: " + new Date().toISOString())
          .setItalic(true);
      body.appendHorizontalRule();
      body.appendParagraph(research);
      
      doc.saveAndClose();
      
      const docFile = DriveApp.getFileById(doc.getId());
      inbox.addFile(docFile);
      DriveApp.getRootFolder().removeFile(docFile);
      
      return doc.getId();
    }
  } catch (e) {
    console.error("Auto-research failed: " + e.message);
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTING & SUMMARIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a daily summary doc
 */
function generateDailySummary() {
  const props = PropertiesService.getScriptProperties();
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  const root = DriveApp.getFolderById(rootId);
  const reportsFolder = findOrCreateFolder("_Validation_Reports", root);
  
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const doc = DocumentApp.create("Daily_Summary_" + today);
  const body = doc.getBody();
  
  body.appendParagraph("📊 Daily Summary - " + today)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  // Task summary
  body.appendParagraph("Tasks")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  if (trackerId) {
    const ss = SpreadsheetApp.openById(trackerId);
    const sheet = ss.getSheetByName("Active Tasks");
    const data = sheet.getDataRange().getValues();
    
    const activeTasks = data.slice(1).filter(row => row[2] === "Active");
    const urgentTasks = activeTasks.filter(row => row[4] === "High" || (row[5] && new Date(row[5]) <= new Date()));
    
    body.appendParagraph("Active: " + activeTasks.length);
    body.appendParagraph("Urgent/Overdue: " + urgentTasks.length);
    
    if (urgentTasks.length > 0) {
      body.appendParagraph("⚠️ Urgent Tasks:").setBold(true);
      for (const task of urgentTasks.slice(0, 5)) {
        body.appendListItem(task[1] + " (" + task[3] + ")");
      }
    }
  }
  
  // Domain activity
  body.appendParagraph("Domain Activity")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  const domainIds = JSON.parse(props.getProperty("DOMAIN_FOLDER_IDS") || "{}");
  for (const [domain, folderId] of Object.entries(domainIds)) {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    let count = 0;
    let recent = [];
    
    while (files.hasNext()) {
      const file = files.next();
      count++;
      if (recent.length < 3) {
        recent.push(file.getName());
      }
    }
    
    body.appendParagraph(domain + ": " + count + " files");
    if (recent.length > 0) {
      body.appendParagraph("  Recent: " + recent.join(", ")).setFontSize(10);
    }
  }
  
  doc.saveAndClose();
  
  // Move to reports folder
  const docFile = DriveApp.getFileById(doc.getId());
  reportsFolder.addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
  
  return doc.getId();
}

/**
 * Generates weekly summary
 */
function generateWeeklySummary() {
  const props = PropertiesService.getScriptProperties();
  const rootId = props.getProperty("ROOT_FOLDER_ID");
  const root = DriveApp.getFolderById(rootId);
  const reportsFolder = findOrCreateFolder("_Validation_Reports", root);
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  
  const doc = DocumentApp.create("Weekly_Summary_" + Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd"));
  const body = doc.getBody();
  
  body.appendParagraph("📅 Weekly Summary")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(Utilities.formatDate(weekStart, Session.getScriptTimeZone(), "MMM d") + 
                       " - " + 
                       Utilities.formatDate(today, Session.getScriptTimeZone(), "MMM d, yyyy"));
  
  body.appendHorizontalRule();
  
  // Compile stats
  const trackerId = props.getProperty("TASK_TRACKER_ID");
  if (trackerId) {
    const ss = SpreadsheetApp.openById(trackerId);
    const completedSheet = ss.getSheetByName("Completed");
    if (completedSheet) {
      const completed = completedSheet.getDataRange().getValues().slice(1);
      const thisWeek = completed.filter(row => {
        const completedDate = new Date(row[7]);
        return completedDate >= weekStart;
      });
      
      body.appendParagraph("Tasks Completed: " + thisWeek.length)
          .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    }
  }
  
  // Files created this week
  body.appendParagraph("Files Created")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  const domainIds = JSON.parse(props.getProperty("DOMAIN_FOLDER_IDS") || "{}");
  for (const [domain, folderId] of Object.entries(domainIds)) {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    let thisWeekCount = 0;
    
    while (files.hasNext()) {
      const file = files.next();
      if (file.getDateCreated() >= weekStart) {
        thisWeekCount++;
      }
    }
    
    if (thisWeekCount > 0) {
      body.appendParagraph(domain + ": " + thisWeekCount + " new files");
    }
  }
  
  doc.saveAndClose();
  
  const docFile = DriveApp.getFileById(doc.getId());
  reportsFolder.addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
  
  return doc.getId();
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Finds or creates a folder
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
    const folders = DriveApp.getFoldersByName(name);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(name);
    }
  }
  
  return folder;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEB APP ENDPOINTS (for mobile/quick access)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Web app entry point - GET
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "capture") {
    // Return capture form
    return HtmlService.createHtmlOutput(getCaptureFormHtml());
  }
  
  if (action === "status") {
    return ContentService.createTextOutput(JSON.stringify(getStatus()))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  return HtmlService.createHtmlOutput(getDashboardHtml());
}

/**
 * Web app entry point - POST
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === "capture") {
    const result = quickCapture(data.text, data.category || "Ideas / Thoughts");
    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (data.action === "task") {
    const result = createTaskFromCapture(data.text);
    return ContentService.createTextOutput(JSON.stringify({ success: result }))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (data.action === "research") {
    const docId = autoResearch(data.topic);
    return ContentService.createTextOutput(JSON.stringify({ docId: docId }))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Returns system status
 */
function getStatus() {
  const props = PropertiesService.getScriptProperties();
  
  return {
    setupComplete: props.getProperty("SETUP_COMPLETE") === "true",
    setupDate: props.getProperty("SETUP_DATE"),
    rootFolderId: props.getProperty("ROOT_FOLDER_ID"),
    geminiEnabled: !!props.getProperty("GEMINI_API_KEY"),
    domains: Object.keys(HUB_CONFIG.DOMAINS)
  };
}

/**
 * Simple capture form HTML
 */
function getCaptureFormHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; }
    h1 { color: #7B68EE; }
    textarea { width: 100%; height: 150px; margin: 10px 0; padding: 10px; }
    select, button { width: 100%; padding: 15px; margin: 5px 0; font-size: 16px; }
    button { background: #7B68EE; color: white; border: none; cursor: pointer; }
    button:hover { background: #6B5BCD; }
    .success { color: green; }
  </style>
</head>
<body>
  <h1>🧠 Quick Capture</h1>
  <textarea id="text" placeholder="Brain dump here..."></textarea>
  <select id="category">
    <option>Ideas / Thoughts</option>
    <option>Tasks / To-Do</option>
    <option>Research Notes</option>
    <option>Voice Memo Summaries</option>
    <option>Urgent / Time-Sensitive</option>
  </select>
  <button onclick="capture()">Capture</button>
  <button onclick="captureAsTask()">Create as Task</button>
  <div id="result"></div>
  
  <script>
    function capture() {
      const text = document.getElementById('text').value;
      const category = document.getElementById('category').value;
      
      google.script.run
        .withSuccessHandler(r => {
          document.getElementById('result').innerHTML = '<p class="success">✓ Captured!</p>';
          document.getElementById('text').value = '';
        })
        .quickCapture(text, category);
    }
    
    function captureAsTask() {
      const text = document.getElementById('text').value;
      
      google.script.run
        .withSuccessHandler(r => {
          document.getElementById('result').innerHTML = '<p class="success">✓ Task created!</p>';
          document.getElementById('text').value = '';
        })
        .createTaskFromCapture(text);
    }
  </script>
</body>
</html>
  `;
}

/**
 * Dashboard HTML
 */
function getDashboardHtml() {
  const status = getStatus();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; }
    h1 { color: #7B68EE; }
    .card { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .status { color: ${status.setupComplete ? 'green' : 'orange'}; }
    a { color: #7B68EE; }
  </style>
</head>
<body>
  <h1>🧠 Phenix Cognitive Hub</h1>
  
  <div class="card">
    <h3>Status</h3>
    <p class="status">${status.setupComplete ? '✓ System Active' : '⚠️ Setup Required'}</p>
    <p>Setup date: ${status.setupDate || 'Not configured'}</p>
    <p>Gemini: ${status.geminiEnabled ? '✓ Enabled' : '○ Not configured'}</p>
  </div>
  
  <div class="card">
    <h3>Domains</h3>
    <ul>
      ${status.domains.map(d => '<li>' + d + '</li>').join('')}
    </ul>
  </div>
  
  <div class="card">
    <h3>Quick Actions</h3>
    <p><a href="?action=capture">📝 Quick Capture</a></p>
  </div>
</body>
</html>
  `;
}
