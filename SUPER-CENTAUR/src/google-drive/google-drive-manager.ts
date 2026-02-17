/**
 * Google Drive Manager — OAuth2 authentication, file browsing, search, and import.
 * Tokens are persisted in DataStore so the user stays connected across restarts.
 */

import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';
import { DataStore } from '../database/store';

interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  iconLink?: string;
  webViewLink?: string;
  parents?: string[];
  isFolder: boolean;
}

export class GoogleDriveManager {
  private logger: Logger;
  private store: DataStore;
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;
  private drive: drive_v3.Drive | null = null;

  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ];

  private static readonly TOKEN_ID = 'google_oauth_tokens';
  private static readonly COLLECTION = 'google-drive-tokens';
  private static readonly IMPORTS_COLLECTION = 'google-drive-imports';

  constructor() {
    this.logger = new Logger('GoogleDriveManager');
    this.store = DataStore.getInstance();

    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 3001}/api/google-drive/callback`;

    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );

    // Restore tokens from DataStore if they exist
    this.restoreTokens();
  }

  async start(): Promise<void> {
    this.logger.info('Google Drive Manager started');
    if (!this.clientId || !this.clientSecret) {
      this.logger.warn('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Drive connector disabled');
    }
  }

  async stop(): Promise<void> {
    this.logger.info('Google Drive Manager stopped');
  }

  /** Check whether the user has valid credentials configured */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  /** Check whether we have a valid (possibly refreshed) token */
  isAuthenticated(): boolean {
    const creds = this.oauth2Client.credentials;
    return !!(creds && creds.access_token);
  }

  /** Generate the Google OAuth2 consent URL */
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GoogleDriveManager.SCOPES,
      prompt: 'consent',
    });
  }

  /** Exchange the authorization code for tokens and persist them */
  async handleCallback(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.initDrive();

    // Persist tokens
    const existing = this.store.get(GoogleDriveManager.COLLECTION, GoogleDriveManager.TOKEN_ID);
    if (existing) {
      this.store.update(GoogleDriveManager.COLLECTION, GoogleDriveManager.TOKEN_ID, { tokens });
    } else {
      this.store.insert(GoogleDriveManager.COLLECTION, { id: GoogleDriveManager.TOKEN_ID, tokens });
    }

    this.logger.info('Google Drive authenticated and tokens stored');
  }

  /** Revoke tokens and clear stored credentials */
  async disconnect(): Promise<void> {
    try {
      if (this.oauth2Client.credentials?.access_token) {
        await this.oauth2Client.revokeCredentials();
      }
    } catch (err) {
      this.logger.warn('Token revocation failed (may already be expired):', err);
    }
    this.oauth2Client.setCredentials({});
    this.drive = null;
    this.store.delete(GoogleDriveManager.COLLECTION, GoogleDriveManager.TOKEN_ID);
    this.logger.info('Google Drive disconnected');
  }

  /** List files in a folder (or root). Supports search query and pagination. */
  async listFiles(
    folderId?: string,
    pageToken?: string,
    query?: string,
    pageSize = 30,
  ): Promise<{ files: DriveFileInfo[]; nextPageToken?: string }> {
    this.ensureDrive();

    const qParts: string[] = [];
    if (folderId) {
      qParts.push(`'${folderId}' in parents`);
    }
    if (query) {
      qParts.push(`fullText contains '${query.replace(/'/g, "\\'")}'`);
    }
    qParts.push('trashed = false');

    const res = await this.drive!.files.list({
      q: qParts.join(' and '),
      pageSize,
      pageToken: pageToken || undefined,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, createdTime, iconLink, webViewLink, parents)',
      orderBy: 'folder,modifiedTime desc',
    });

    const files: DriveFileInfo[] = (res.data.files || []).map((f) => ({
      id: f.id!,
      name: f.name!,
      mimeType: f.mimeType!,
      size: f.size || undefined,
      modifiedTime: f.modifiedTime || undefined,
      createdTime: f.createdTime || undefined,
      iconLink: f.iconLink || undefined,
      webViewLink: f.webViewLink || undefined,
      parents: f.parents || undefined,
      isFolder: f.mimeType === 'application/vnd.google-apps.folder',
    }));

    return { files, nextPageToken: res.data.nextPageToken || undefined };
  }

  /** Search files across the entire Drive */
  async searchFiles(query: string, pageSize = 30): Promise<{ files: DriveFileInfo[]; nextPageToken?: string }> {
    return this.listFiles(undefined, undefined, query, pageSize);
  }

  /** Get metadata for a single file */
  async getFileMetadata(fileId: string): Promise<DriveFileInfo> {
    this.ensureDrive();

    const res = await this.drive!.files.get({
      fileId,
      fields: 'id, name, mimeType, size, modifiedTime, createdTime, iconLink, webViewLink, parents',
    });

    const f = res.data;
    return {
      id: f.id!,
      name: f.name!,
      mimeType: f.mimeType!,
      size: f.size || undefined,
      modifiedTime: f.modifiedTime || undefined,
      createdTime: f.createdTime || undefined,
      iconLink: f.iconLink || undefined,
      webViewLink: f.webViewLink || undefined,
      parents: f.parents || undefined,
      isFolder: f.mimeType === 'application/vnd.google-apps.folder',
    };
  }

  /** Import (download) a file — saves to local data/google-drive-imports/ and records in DataStore */
  async importFile(fileId: string): Promise<any> {
    this.ensureDrive();

    const meta = await this.getFileMetadata(fileId);

    // Google Docs/Sheets/Slides must be exported, not downloaded directly
    const exportMimeMap: Record<string, string> = {
      'application/vnd.google-apps.document': 'application/pdf',
      'application/vnd.google-apps.spreadsheet': 'text/csv',
      'application/vnd.google-apps.presentation': 'application/pdf',
      'application/vnd.google-apps.drawing': 'image/png',
    };

    const importsDir = path.join(process.cwd(), 'data', 'google-drive-imports');
    if (!fs.existsSync(importsDir)) fs.mkdirSync(importsDir, { recursive: true });

    const safeName = meta.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const exportMime = exportMimeMap[meta.mimeType];
    const ext = exportMime ? '.' + exportMime.split('/')[1] : '';
    const localPath = path.join(importsDir, `${fileId}_${safeName}${ext}`);

    if (exportMime) {
      // Google Workspace file — export
      const res = await this.drive!.files.export(
        { fileId, mimeType: exportMime },
        { responseType: 'stream' },
      );
      await this.streamToFile(res.data as any, localPath);
    } else {
      // Binary file — download
      const res = await this.drive!.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );
      await this.streamToFile(res.data as any, localPath);
    }

    // Record import in DataStore
    const record = this.store.insert(GoogleDriveManager.IMPORTS_COLLECTION, {
      fileId: meta.id,
      fileName: meta.name,
      mimeType: exportMime || meta.mimeType,
      size: meta.size,
      localPath,
      importedAt: new Date().toISOString(),
    });

    this.logger.info(`Imported "${meta.name}" → ${localPath}`);
    return record;
  }

  /** Get import history from DataStore */
  getImportHistory(limit = 50): any[] {
    return this.store.recent(GoogleDriveManager.IMPORTS_COLLECTION, limit);
  }

  /** Overall status summary */
  async getStatus(): Promise<any> {
    return {
      configured: this.isConfigured(),
      authenticated: this.isAuthenticated(),
      importCount: this.store.count(GoogleDriveManager.IMPORTS_COLLECTION),
      timestamp: new Date().toISOString(),
    };
  }

  // ── Private helpers ─────────────────────────────────────────────

  private restoreTokens(): void {
    const record = this.store.get<any>(GoogleDriveManager.COLLECTION, GoogleDriveManager.TOKEN_ID);
    if (record?.tokens) {
      this.oauth2Client.setCredentials(record.tokens);
      this.initDrive();
      this.logger.info('Restored Google Drive tokens from DataStore');
    }
  }

  private initDrive(): void {
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  private ensureDrive(): void {
    if (!this.drive) {
      throw new Error('Google Drive not authenticated. Please connect first.');
    }
  }

  private streamToFile(stream: NodeJS.ReadableStream, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(dest);
      stream.pipe(ws);
      ws.on('finish', resolve);
      ws.on('error', reject);
    });
  }
}
