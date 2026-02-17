/**
 * Sovereign Google Drive Manager — Extends GoogleDriveManager with sovereignty validation
 * 
 * ENTITY PROTOCOL:
 * - Purpose: Bridge between Google Workspace and sovereign layer with binary checks
 * - Job: Validate all imports for sovereignty compliance before local storage
 * - Interface: Same as GoogleDriveManager with additional sovereignty methods
 * - Binary decisions: YES/NO validation for every file import
 */

import { GoogleDriveManager, DriveFileInfo } from '../google-drive/google-drive-manager';
import { SovereigntyValidator, ValidationRequest, ValidationResult } from './SovereigntyValidator';
import { Logger } from '../utils/logger';

export interface SovereignImportResult {
  fileId: string;
  fileName: string;
  sovereigntyStatus: 'APPROVED' | 'REJECTED' | 'REQUIRES_REVIEW';
  validationResult: ValidationResult;
  localPath?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface SovereigntyStatus {
  overallStatus: 'GREEN' | 'YELLOW' | 'RED';
  googleDriveStatus: 'CONNECTED' | 'DISCONNECTED' | 'UNAVAILABLE';
  validationStats: {
    totalImports: number;
    approved: number;
    rejected: number;
    pendingReview: number;
  };
  lastValidation: string;
}

export class SovereignGoogleDriveManager {
  private logger: Logger;
  private googleDriveManager: GoogleDriveManager;
  private sovereigntyValidator: SovereigntyValidator;
  
  private static readonly SOVEREIGN_IMPORTS_COLLECTION = 'sovereign-google-drive-imports';

  constructor(googleDriveManager?: GoogleDriveManager) {
    this.logger = new Logger('SovereignGoogleDriveManager');
    this.googleDriveManager = googleDriveManager || new GoogleDriveManager();
    this.sovereigntyValidator = new SovereigntyValidator();
  }

  async start(): Promise<void> {
    this.logger.info('Sovereign Google Drive Manager started');
    await this.sovereigntyValidator.start();
  }

  async stop(): Promise<void> {
    this.logger.info('Sovereign Google Drive Manager stopped');
    await this.sovereigntyValidator.stop();
  }

  /**
   * Get overall sovereignty status
   */
  async getSovereigntyStatus(): Promise<SovereigntyStatus> {
    const googleDriveStatus = this.googleDriveManager.isAuthenticated() ? 'CONNECTED' : 
                             this.googleDriveManager.isConfigured() ? 'DISCONNECTED' : 'UNAVAILABLE';
    
    const validatorStatus = this.sovereigntyValidator.getSovereigntyStatus();
    
    // Get import statistics (simplified - would need actual data store query)
    const importStats = {
      totalImports: 0,
      approved: 0,
      rejected: 0,
      pendingReview: 0
    };
    
    return {
      overallStatus: validatorStatus.status,
      googleDriveStatus,
      validationStats: importStats,
      lastValidation: validatorStatus.lastCheck
    };
  }

  /**
   * Enhanced import with sovereignty validation
   * Returns detailed sovereignty status along with import result
   */
  async importFileWithSovereignty(fileId: string, userId?: string): Promise<SovereignImportResult> {
    this.logger.info(`Starting sovereignty-validated import for file: ${fileId}`);
    
    // Step 1: Get file metadata from Google Drive
    let fileMetadata;
    try {
      fileMetadata = await this.googleDriveManager.getFileMetadata(fileId);
    } catch (error) {
      this.logger.error(`Failed to get file metadata: ${error}`);
      throw new Error(`Failed to retrieve file metadata: ${error}`);
    }
    
    // Step 2: Prepare validation request
    const validationRequest: ValidationRequest = {
      dataType: this.mapMimeTypeToDataType(fileMetadata.mimeType),
      source: 'google-drive',
      metadata: {
        mimeType: fileMetadata.mimeType,
        size: fileMetadata.size ? parseInt(fileMetadata.size) : undefined,
        fileName: fileMetadata.name,
        googleDriveId: fileMetadata.id,
        googleDriveMetadata: {
          createdTime: fileMetadata.createdTime,
          modifiedTime: fileMetadata.modifiedTime,
          isFolder: fileMetadata.isFolder
        }
      },
      userId
    };
    
    // Step 3: Run sovereignty validation
    const validationResult = await this.sovereigntyValidator.validate(validationRequest);
    
    // Step 4: Determine sovereignty status
    let sovereigntyStatus: 'APPROVED' | 'REJECTED' | 'REQUIRES_REVIEW';
    if (validationResult.sovereigntyApproved) {
      sovereigntyStatus = 'APPROVED';
    } else {
      // Check if it's a hard rejection or just requires review
      const hasCriticalFailures = validationResult.recommendations.some(rec => 
        rec.includes('rejected') || rec.includes('incompatible') || rec.includes('illegal')
      );
      sovereigntyStatus = hasCriticalFailures ? 'REJECTED' : 'REQUIRES_REVIEW';
    }
    
    // Step 5: If approved, proceed with actual import
    let localPath: string | undefined;
    if (sovereigntyStatus === 'APPROVED') {
      try {
        const importResult = await this.googleDriveManager.importFile(fileId);
        localPath = importResult.localPath;
        this.logger.info(`Sovereignty-approved import completed: ${fileMetadata.name}`);
      } catch (error) {
        this.logger.error(`Import failed after sovereignty approval: ${error}`);
        sovereigntyStatus = 'REJECTED'; // Downgrade status due to import failure
        validationResult.reasoning.push(`Import failed: ${error}`);
      }
    } else {
      this.logger.warn(`Sovereignty validation ${sovereigntyStatus.toLowerCase()} for file: ${fileMetadata.name}`);
    }
    
    // Step 6: Create sovereign import record
    const sovereignImport: SovereignImportResult = {
      fileId,
      fileName: fileMetadata.name,
      sovereigntyStatus,
      validationResult,
      localPath,
      metadata: {
        mimeType: fileMetadata.mimeType,
        size: fileMetadata.size,
        googleDriveMetadata: {
          createdTime: fileMetadata.createdTime,
          modifiedTime: fileMetadata.modifiedTime,
          webViewLink: fileMetadata.webViewLink
        }
      },
      timestamp: new Date().toISOString()
    };
    
    return sovereignImport;
  }

  /**
   * Batch import with sovereignty validation
   * Returns results for each file with individual sovereignty status
   */
  async importFilesWithSovereignty(fileIds: string[], userId?: string): Promise<SovereignImportResult[]> {
    const results: SovereignImportResult[] = [];
    
    for (const fileId of fileIds) {
      try {
        const result = await this.importFileWithSovereignty(fileId, userId);
        results.push(result);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.logger.error(`Failed to import file ${fileId}: ${error}`);
        results.push({
          fileId,
          fileName: 'Unknown',
          sovereigntyStatus: 'REJECTED',
          validationResult: {
            sovereigntyApproved: false,
            decisionId: 'IMPORT_ERROR',
            reasoning: [`Import failed: ${error}`],
            recommendations: ['Check file permissions and connectivity'],
            auditId: `error_${Date.now()}`,
            timestamp: new Date().toISOString()
          },
          metadata: { error: String(error) },
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return results;
  }

  /**
   * Scan Google Drive folder for sovereignty-eligible files
   * Returns list of files with preliminary sovereignty assessment
   */
  async scanFolderForSovereignty(folderId?: string, userId?: string): Promise<{
    files: Array<{
      id: string;
      name: string;
      mimeType: string;
      size?: string;
      preliminaryStatus: 'LIKELY_APPROVED' | 'LIKELY_REJECTED' | 'NEEDS_REVIEW';
      validationPreview: string[];
    }>;
    folderSummary: {
      totalFiles: number;
      likelyApproved: number;
      likelyRejected: number;
      needsReview: number;
    };
  }> {
    this.logger.info(`Scanning folder for sovereignty eligibility: ${folderId || 'root'}`);
    
    // Get files from Google Drive
    const { files } = await this.googleDriveManager.listFiles(folderId, undefined, undefined, 1000);
    
    const results = [];
    let likelyApproved = 0;
    let likelyRejected = 0;
    let needsReview = 0;
    
    for (const file of files) {
      // Skip folders for now (could handle recursively)
      if (file.isFolder) continue;
      
      const preliminaryStatus = this.getPreliminaryStatus(file);
      const validationPreview = this.getValidationPreview(file);
      
      results.push({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        preliminaryStatus,
        validationPreview
      });
      
      switch (preliminaryStatus) {
        case 'LIKELY_APPROVED':
          likelyApproved++;
          break;
        case 'LIKELY_REJECTED':
          likelyRejected++;
          break;
        case 'NEEDS_REVIEW':
          needsReview++;
          break;
      }
    }
    
    return {
      files: results,
      folderSummary: {
        totalFiles: results.length,
        likelyApproved,
        likelyRejected,
        needsReview
      }
    };
  }

  /**
   * Get sovereignty decision history for a user
   */
  getSovereigntyHistory(userId?: string, limit = 50): any[] {
    // This would query the sovereignty audit trail
    // For now, return empty array - implementation would depend on data store
    return [];
  }

  /**
   * Get binary sovereignty dashboard data
   */
  getBinaryDashboard(): {
    green: number;
    yellow: number;
    red: number;
    lastUpdated: string;
    recentDecisions: Array<{
      file: string;
      decision: 'YES' | 'NO';
      timestamp: string;
    }>;
  } {
    const status = this.sovereigntyValidator.getSovereigntyStatus();
    
    // Simplified dashboard - would need actual data
    return {
      green: status.status === 'GREEN' ? 1 : 0,
      yellow: status.status === 'YELLOW' ? 1 : 0,
      red: status.status === 'RED' ? 1 : 0,
      lastUpdated: status.lastCheck,
      recentDecisions: []
    };
  }

  // ── Delegated Google Drive methods ──────────────────────────────
  
  isConfigured(): boolean {
    return this.googleDriveManager.isConfigured();
  }

  isAuthenticated(): boolean {
    return this.googleDriveManager.isAuthenticated();
  }

  getAuthUrl(): string {
    return this.googleDriveManager.getAuthUrl();
  }

  async handleCallback(code: string): Promise<void> {
    return this.googleDriveManager.handleCallback(code);
  }

  async disconnect(): Promise<void> {
    return this.googleDriveManager.disconnect();
  }

  async listFiles(folderId?: string, pageToken?: string, query?: string, pageSize = 30) {
    return this.googleDriveManager.listFiles(folderId, pageToken, query, pageSize);
  }

  async searchFiles(query: string, pageSize = 30) {
    return this.googleDriveManager.searchFiles(query, pageSize);
  }

  async getFileMetadata(fileId: string) {
    return this.googleDriveManager.getFileMetadata(fileId);
  }

  async importFile(fileId: string): Promise<any> {
    // Default import without sovereignty validation (legacy compatibility)
    this.logger.warn('Using legacy importFile without sovereignty validation');
    return this.googleDriveManager.importFile(fileId);
  }

  getImportHistory(limit = 50): any[] {
    return this.googleDriveManager.getImportHistory(limit);
  }

  async getStatus(): Promise<any> {
    const googleStatus = await this.googleDriveManager.getStatus();
    const sovereigntyStatus = await this.getSovereigntyStatus();
    
    return {
      ...googleStatus,
      sovereignty: sovereigntyStatus
    };
  }

  // ── Private helpers ─────────────────────────────────────────────

  private mapMimeTypeToDataType(mimeType: string): string {
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('audio')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('text')) return 'text';
    if (mimeType.includes('spreadsheet')) return 'spreadsheet';
    if (mimeType.includes('presentation')) return 'presentation';
    if (mimeType.includes('document')) return 'document';
    if (mimeType.includes('folder')) return 'folder';
    return 'unknown';
  }

  private getPreliminaryStatus(file: any): 'LIKELY_APPROVED' | 'LIKELY_REJECTED' | 'NEEDS_REVIEW' {
    const mimeType = file.mimeType.toLowerCase();
    
    // Likely rejected types
    const rejectedTypes = [
      'application/vnd.google-apps.form', // Google Forms (tracking)
      'application/vnd.google-apps.site', // Google Sites
      'application/vnd.google-apps.script', // Google Apps Script
    ];
    
    if (rejectedTypes.some(type => mimeType.includes(type))) {
      return 'LIKELY_REJECTED';
    }
    
    // Likely approved types
    const approvedTypes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',
      'image/jpeg',
      'image/png',
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.spreadsheet',
      'application/vnd.google-apps.presentation',
    ];
    
    if (approvedTypes.some(type => mimeType.includes(type))) {
      return 'LIKELY_APPROVED';
    }
    
    // Everything else needs review
    return 'NEEDS_REVIEW';
  }

  private getValidationPreview(file: any): string[] {
    const preview: string[] = [];
    const mimeType = file.mimeType.toLowerCase();
    
    // Size check
    if (file.size) {
      const size = parseInt(file.size);
      if (size > 1000000000) { // 1GB
        preview.push('File exceeds 1GB limit for local storage');
      }
    }
    
    // Format check
    const convertibleFormats = [
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.spreadsheet',
      'application/vnd.google-apps.presentation'
    ];
    
    if (convertibleFormats.some(format => mimeType.includes(format))) {
      preview.push('Google Workspace format - will be converted to standard format');
    }
    
    // Biometric/tracking check
    const trackingKeywords = ['form', 'analytics', 'tracking', 'survey'];
    const fileName = file.name.toLowerCase();
    if (trackingKeywords.some(keyword => fileName.includes(keyword))) {
      preview.push('Filename suggests possible tracking/analytics content');
    }
    
    return preview;
  }
}