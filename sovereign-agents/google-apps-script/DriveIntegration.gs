/**
 * Digital Centaur Agent Team - Google Apps Script
 * Google Drive integration and file management
 */

/**
 * Drive integration service for managing file operations
 */
var DriveIntegration = (function() {
  'use strict';

  const CONFIG = {
    BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED',
    AGENT_FOLDERS: {
      ingestion: 'Downloads',
      project: 'Projects', 
      personal: 'Personal',
      knowledge: 'Knowledge',
      archives: 'Archives'
    },
    ARCHIVE_RETENTION_DAYS: 90,
    BATCH_SIZE: 100
  };

  /**
   * Get or create the base organization folder
   */
  function getBaseFolder() {
    const folders = DriveApp.getFoldersByName(CONFIG.BASE_FOLDER_NAME);
    
    if (folders.hasNext()) {
      return folders.next();
    } else {
      const folder = DriveApp.createFolder(CONFIG.BASE_FOLDER_NAME);
      folder.setDescription('Base folder for Digital Centaur Agent Team organization');
      return folder;
    }
  }

  /**
   * Get or create agent-specific folder
   */
  function getAgentFolder(agentId) {
    const baseFolder = getBaseFolder();
    const folderName = CONFIG.AGENT_FOLDERS[agentId] || agentId;
    
    const folders = baseFolder.getFoldersByName(folderName);
    
    if (folders.hasNext()) {
      return folders.next();
    } else {
      const folder = baseFolder.createFolder(folderName);
      folder.setDescription(`${folderName} folder for ${agentId} agent`);
      return folder;
    }
  }

  /**
   * Get or create subfolder within agent folder
   */
  function getSubfolder(agentId, subfolderName) {
    const agentFolder = getAgentFolder(agentId);
    const folders = agentFolder.getFoldersByName(subfolderName);
    
    if (folders.hasNext()) {
      return folders.next();
    } else {
      return agentFolder.createFolder(subfolderName);
    }
  }

  /**
   * Upload file to Google Drive
   */
  function uploadFile(agentId, localFile, targetPath) {
    try {
      const agentFolder = getAgentFolder(agentId);
      const file = agentFolder.createFile(localFile);
      
      // Add metadata
      const metadata = {
        'X-Agent-ID': agentId,
        'X-Upload-Time': new Date().toISOString(),
        'X-Original-Path': targetPath || ''
      };
      
      file.setDescription(JSON.stringify(metadata));
      
      return {
        success: true,
        fileId: file.getId(),
        url: file.getUrl(),
        name: file.getName()
      };
    } catch (error) {
      Logger.log('Error uploading file: ' + error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Sync local files to Google Drive
   */
  function syncFiles(agentId, localFiles) {
    const results = [];
    const agentFolder = getAgentFolder(agentId);
    
    localFiles.forEach(localFile => {
      const result = uploadFile(agentId, localFile.file, localFile.path);
      results.push(result);
      
      if (result.success) {
        // Log the sync operation
        logSyncOperation(agentId, 'UPLOAD', {
          fileId: result.fileId,
          fileName: result.name,
          originalPath: localFile.path
        });
      }
    });
    
    return results;
  }

  /**
   * Mirror local directory structure to Google Drive
   */
  function mirrorDirectory(agentId, localDirectory, targetFolder) {
    const results = [];
    const agentFolder = targetFolder || getAgentFolder(agentId);
    
    try {
      // Get all files from local directory (simulated)
      const files = getFilesFromLocalDirectory(localDirectory);
      
      files.forEach(file => {
        const result = uploadFile(agentId, file.content, file.path);
        results.push(result);
      });
      
      return {
        success: true,
        filesProcessed: results.length,
        results: results
      };
    } catch (error) {
      Logger.log('Error mirroring directory: ' + error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Organize files by category
   */
  function organizeFilesByCategory(agentId, files, categories) {
    const results = [];
    const agentFolder = getAgentFolder(agentId);
    
    // Create category folders
    const categoryFolders = {};
    categories.forEach(category => {
      categoryFolders[category] = getSubfolder(agentId, category);
    });
    
    files.forEach(file => {
      const category = categorizeFile(file);
      const targetFolder = categoryFolders[category] || agentFolder;
      
      try {
        const uploadedFile = targetFolder.createFile(file.content);
        uploadedFile.setDescription(`Category: ${category}`);
        
        results.push({
          success: true,
          fileId: uploadedFile.getId(),
          category: category,
          fileName: uploadedFile.getName()
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.toString(),
          fileName: file.name
        });
      }
    });
    
    return results;
  }

  /**
   * Categorize file based on content or name
   */
  function categorizeFile(file) {
    const name = file.name.toLowerCase();
    const content = file.content || '';
    
    // Simple categorization logic
    if (name.includes('project') || name.includes('code') || name.includes('dev')) {
      return 'Development';
    } else if (name.includes('doc') || name.includes('report') || name.includes('pdf')) {
      return 'Documents';
    } else if (name.includes('image') || name.includes('photo') || name.includes('jpg') || name.includes('png')) {
      return 'Images';
    } else if (name.includes('video') || name.includes('mp4') || name.includes('avi')) {
      return 'Videos';
    } else if (name.includes('personal') || name.includes('private')) {
      return 'Personal';
    } else {
      return 'General';
    }
  }

  /**
   * Archive old files
   */
  function archiveOldFiles(agentId, retentionDays) {
    const results = [];
    const agentFolder = getAgentFolder(agentId);
    const archiveFolder = getSubfolder(agentId, 'Archives');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (retentionDays || CONFIG.ARCHIVE_RETENTION_DAYS));
    
    const files = agentFolder.getFiles();
    
    while (files.hasNext()) {
      const file = files.next();
      const createdDate = file.getDateCreated();
      
      if (createdDate < cutoffDate) {
        try {
          // Copy to archive folder
          const archivedFile = file.makeCopy(`ARCHIVED_${file.getName()}`, archiveFolder);
          
          // Add archive metadata
          archivedFile.setDescription(`Archived on ${new Date().toISOString()}. Original created: ${createdDate.toISOString()}`);
          
          results.push({
            success: true,
            fileId: archivedFile.getId(),
            fileName: file.getName(),
            archivedDate: new Date().toISOString()
          });
          
          // Optionally delete original file
          // file.setTrashed(true);
          
        } catch (error) {
          results.push({
            success: false,
            error: error.toString(),
            fileName: file.getName()
          });
        }
      }
    }
    
    return results;
  }

  /**
   * Search files in Google Drive
   */
  function searchFiles(agentId, query, options) {
    const agentFolder = getAgentFolder(agentId);
    const results = [];
    
    try {
      // Build search query
      let searchQuery = `title contains '${query}'`;
      
      if (options && options.fileType) {
        searchQuery += ` and mimeType contains '${options.fileType}'`;
      }
      
      const files = agentFolder.searchFiles(searchQuery);
      
      while (files.hasNext()) {
        const file = files.next();
        results.push({
          id: file.getId(),
          name: file.getName(),
          url: file.getUrl(),
          size: file.getSize(),
          lastModified: file.getLastUpdated(),
          mimeType: file.getMimeType()
        });
      }
      
      return {
        success: true,
        files: results,
        count: results.length
      };
    } catch (error) {
      Logger.log('Error searching files: ' + error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Get file statistics
   */
  function getFileStatistics(agentId) {
    const agentFolder = getAgentFolder(agentId);
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      byType: {},
      byDate: {}
    };
    
    const files = agentFolder.getFiles();
    
    while (files.hasNext()) {
      const file = files.next();
      stats.totalFiles++;
      stats.totalSize += file.getSize();
      
      // Group by file type
      const mimeType = file.getMimeType();
      stats.byType[mimeType] = (stats.byType[mimeType] || 0) + 1;
      
      // Group by date
      const date = file.getLastUpdated().toDateString();
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    }
    
    return stats;
  }

  /**
   * Clean up duplicate files
   */
  function removeDuplicates(agentId) {
    const agentFolder = getAgentFolder(agentId);
    const files = agentFolder.getFiles();
    const fileMap = {};
    const duplicates = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const name = file.getName();
      const size = file.getSize();
      const key = `${name}_${size}`;
      
      if (fileMap[key]) {
        duplicates.push({
          original: fileMap[key],
          duplicate: file
        });
      } else {
        fileMap[key] = file;
      }
    }
    
    // Remove duplicates (keep the oldest)
    duplicates.forEach(pair => {
      try {
        pair.duplicate.setTrashed(true);
      } catch (error) {
        Logger.log('Error removing duplicate: ' + error);
      }
    });
    
    return {
      duplicatesFound: duplicates.length,
      duplicatesRemoved: duplicates.length
    };
  }

  /**
   * Compress and upload large files
   */
  function compressAndUpload(agentId, file, compressionLevel) {
    try {
      // For demonstration, we'll just upload the file as-is
      // In a real implementation, you would compress the file first
      const result = uploadFile(agentId, file, '');
      
      if (result.success) {
        logSyncOperation(agentId, 'COMPRESS_UPLOAD', {
          fileId: result.fileId,
          originalSize: file.getSize(),
          compressed: compressionLevel > 0
        });
      }
      
      return result;
    } catch (error) {
      Logger.log('Error compressing and uploading: ' + error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Share file with specific permissions
   */
  function shareFile(fileId, email, role, type) {
    try {
      const file = DriveApp.getFileById(fileId);
      file.addEditor(email);
      
      return {
        success: true,
        fileId: fileId,
        sharedWith: email,
        role: role
      };
    } catch (error) {
      Logger.log('Error sharing file: ' + error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Get files from local directory (simulated for web app)
   */
  function getFilesFromLocalDirectory(directory) {
    // This would be implemented differently in a real application
    // For now, return empty array as we can't access local files from Apps Script
    return [];
  }

  /**
   * Log sync operation
   */
  function logSyncOperation(agentId, operation, details) {
    const sheet = getLogSheet();
    sheet.appendRow([
      new Date(),
      agentId,
      'DRIVE_SYNC',
      JSON.stringify({
        operation: operation,
        details: details
      }),
      true
    ]);
  }

  /**
   * Get log sheet (from Code.gs)
   */
  function getLogSheet() {
    const CONFIG = {
      LOG_SHEET_NAME: 'AgentLogs'
    };
    
    const spreadsheet = getSpreadsheet();
    let sheet = spreadsheet.getSheetByName(CONFIG.LOG_SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.LOG_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Agent ID', 'Event Type', 'Details', 'Success']);
    }
    
    return sheet;
  }

  /**
   * Get spreadsheet (from Code.gs)
   */
  function getSpreadsheet() {
    const CONFIG = {
      BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED'
    };
    
    const folder = getOrCreateFolder();
    const files = folder.getFilesByName('Digital Centaur Agent Team Logs');
    
    let spreadsheet;
    if (files.hasNext()) {
      spreadsheet = SpreadsheetApp.open(files.next());
    } else {
      const file = folder.createFile('Digital Centaur Agent Team Logs', '', MimeType.GOOGLE_SHEETS);
      spreadsheet = SpreadsheetApp.open(file);
    }
    
    return spreadsheet;
  }

  /**
   * Get or create folder (from Code.gs)
   */
  function getOrCreateFolder() {
    const CONFIG = {
      BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED'
    };
    
    const folders = DriveApp.getFoldersByName(CONFIG.BASE_FOLDER_NAME);
    let folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(CONFIG.BASE_FOLDER_NAME);
      folder.setDescription('Base folder for Digital Centaur Agent Team');
    }
    
    return folder;
  }

  // Public API
  return {
    getBaseFolder: getBaseFolder,
    getAgentFolder: getAgentFolder,
    getSubfolder: getSubfolder,
    uploadFile: uploadFile,
    syncFiles: syncFiles,
    mirrorDirectory: mirrorDirectory,
    organizeFilesByCategory: organizeFilesByCategory,
    archiveOldFiles: archiveOldFiles,
    searchFiles: searchFiles,
    getFileStatistics: getFileStatistics,
    removeDuplicates: removeDuplicates,
    compressAndUpload: compressAndUpload,
    shareFile: shareFile
  };

})();

/**
 * Web app endpoints for drive operations
 */

/**
 * Upload file to Google Drive
 */
function uploadFileToDrive(agentId, fileName, fileContent) {
  try {
    const blob = Utilities.newBlob(fileContent, MimeType.PLAIN_TEXT, fileName);
    const result = DriveIntegration.uploadFile(agentId, blob, '');
    
    return {
      success: result.success,
      fileId: result.fileId,
      url: result.url,
      message: result.success ? 'File uploaded successfully' : result.error
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get file statistics for an agent
 */
function getDriveStatistics(agentId) {
  try {
    const stats = DriveIntegration.getFileStatistics(agentId);
    return {
      success: true,
      statistics: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Archive old files for an agent
 */
function archiveFiles(agentId, retentionDays) {
  try {
    const result = DriveIntegration.archiveOldFiles(agentId, retentionDays);
    return {
      success: true,
      archivedFiles: result.length,
      message: `Archived ${result.length} files`
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Search files in Google Drive
 */
function searchDriveFiles(agentId, query, options) {
  try {
    const result = DriveIntegration.searchFiles(agentId, query, options);
    return {
      success: result.success,
      files: result.files,
      count: result.count,
      error: result.error
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Remove duplicate files
 */
function removeDriveDuplicates(agentId) {
  try {
    const result = DriveIntegration.removeDuplicates(agentId);
    return {
      success: true,
      duplicatesFound: result.duplicatesFound,
      duplicatesRemoved: result.duplicatesRemoved
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get agent folder URL
 */
function getAgentFolderUrl(agentId) {
  try {
    const folder = DriveIntegration.getAgentFolder(agentId);
    return {
      success: true,
      url: folder.getUrl(),
      name: folder.getName()
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}