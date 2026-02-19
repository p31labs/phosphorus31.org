function consolidateAllCode() {
  // Fetch all scripts in the current project via the Drive API 
  // Note: This requires the Google Drive API service to be enabled in "Services +"
  const projectId = ScriptApp.getScriptId();
  const metadata = Drive.Files.get(projectId);
  
  // Since direct file-content extraction via script is restricted for the 
  // project it's running in, the most reliable manual way is below:
  console.log("--- START CONSOLIDATION ---");
  // You will need to manually copy the files listed in your sidebar
}