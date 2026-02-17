/**
 * File System Type Definitions
 * 
 * Defines types for file system monitoring and operations.
 */

export interface FileChange {
  id: string;
  type: 'add' | 'modify' | 'delete' | 'addDir' | 'deleteDir';
  filePath: string;
  timestamp: string;
  size?: number;
  extension?: string;
  isBinary?: boolean;
  previousSize?: number;
  checksum?: string;
}

export interface FileSystemEvent {
  id: string;
  type: 'scan' | 'change' | 'error' | 'integrity-check';
  timestamp: string;
  filesScanned?: number;
  scanTime?: number;
  directories?: number;
  files?: number;
  changes?: FileChange[];
  errors?: string[];
  integrityIssues?: string[];
}

export interface DirectoryStructure {
  path: string;
  name: string;
  type: 'directory' | 'file';
  size: number;
  modified: string;
  children?: DirectoryStructure[];
  depth: number;
}

export interface FileMetadata {
  path: string;
  name: string;
  extension: string;
  size: number;
  created: string;
  modified: string;
  accessed: string;
  isBinary: boolean;
  checksum: string;
  mimeType: string;
  permissions: string;
}

export interface FileSystemStats {
  totalFiles: number;
  totalSize: number;
  directories: number;
  largestFiles: Array<{ path: string; size: number }>;
  deepestPath: { path: string; depth: number };
  fileTypes: Record<string, number>;
  averageFileSize: number;
  lastScan: string;
}

export interface FilePattern {
  name: string;
  pattern: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'organization' | 'maintenance';
}

export interface FileIntegrityCheck {
  filePath: string;
  expectedChecksum: string;
  actualChecksum: string;
  status: 'valid' | 'modified' | 'missing' | 'corrupted';
  timestamp: string;
  issues: string[];
}

export interface FileSystemAlert {
  id: string;
  type: 'high-usage' | 'rapid-changes' | 'integrity-failure' | 'access-error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  data: any;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface FileOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'copy' | 'rename';
  sourcePath: string;
  targetPath?: string;
  timestamp: string;
  size?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  error?: string;
  metadata: {
    agent: string;
    reason: string;
    backup?: string;
  };
}

export interface FileIndex {
  path: string;
  metadata: FileMetadata;
  contentHash?: string;
  tags: string[];
  lastIndexed: string;
  indexedBy: string;
}

export interface FileSearchQuery {
  query: string;
  filters: {
    extensions?: string[];
    size?: { min?: number; max?: number };
    modified?: { start?: string; end?: string };
    type?: 'text' | 'binary' | 'all';
    path?: string;
  };
  options: {
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'size' | 'modified' | 'created';
    sortOrder?: 'asc' | 'desc';
    fuzzy?: boolean;
  };
}

export interface FileSearchResult {
  files: FileMetadata[];
  total: number;
  query: FileSearchQuery;
  took: number;
  highlights?: Record<string, string[]>;
}

export interface FileWatcherConfig {
  paths: string[];
  ignorePatterns: string[];
  depth: number;
  interval: number;
  binaryInterval: number;
  persistent: boolean;
  followSymlinks: boolean;
  awaitWriteFinish: {
    stabilityThreshold: number;
    pollInterval: number;
  };
}

export interface FileSystemCache {
  files: Map<string, FileMetadata>;
  directories: Map<string, DirectoryStructure>;
  checksums: Map<string, string>;
  lastUpdated: string;
  version: string;
}

export interface FileBatchOperation {
  id: string;
  type: 'move' | 'copy' | 'delete' | 'rename' | 'tag';
  files: string[];
  targetPath?: string;
  options: {
    recursive?: boolean;
    overwrite?: boolean;
    backup?: boolean;
    dryRun?: boolean;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  results: Array<{
    file: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
  timestamp: string;
}

export interface FileOrganizationRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  targetDirectory: string;
  conditions: {
    extensions?: string[];
    size?: { min?: number; max?: number };
    age?: { days?: number; modifiedBefore?: string };
    content?: string[];
  };
  actions: {
    move?: boolean;
    copy?: boolean;
    rename?: string;
    tag?: string[];
    compress?: boolean;
  };
  enabled: boolean;
  priority: number;
  lastRun?: string;
  runCount: number;
}

export interface FileBackup {
  id: string;
  originalPath: string;
  backupPath: string;
  timestamp: string;
  size: number;
  checksum: string;
  retention: {
    days: number;
    created: string;
    expires: string;
  };
  status: 'active' | 'expired' | 'deleted';
}

export interface FileVersion {
  id: string;
  filePath: string;
  version: number;
  checksum: string;
  timestamp: string;
  size: number;
  metadata: Record<string, any>;
  diff?: string;
}

export interface FileLock {
  id: string;
  filePath: string;
  lockedBy: string;
  lockType: 'read' | 'write';
  timestamp: string;
  expiresAt?: string;
  metadata: {
    operation: string;
    agent: string;
  };
}

export interface FileSystemMetrics {
  diskUsage: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  fileCount: number;
  directoryCount: number;
  operationsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  lastUpdated: string;
}

export interface FileCompression {
  id: string;
  originalPath: string;
  compressedPath: string;
  algorithm: 'gzip' | 'brotli' | 'lzma' | 'deflate';
  compressionRatio: number;
  timestamp: string;
  sizeBefore: number;
  sizeAfter: number;
  checksum: string;
}

export interface FileEncryption {
  id: string;
  originalPath: string;
  encryptedPath: string;
  algorithm: string;
  keyId: string;
  timestamp: string;
  sizeBefore: number;
  sizeAfter: number;
  checksum: string;
}

export interface FileAuditLog {
  id: string;
  timestamp: string;
  operation: string;
  filePath: string;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  metadata: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

export interface FileTemplate {
  id: string;
  name: string;
  description: string;
  path: string;
  content: string;
  variables: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface FileValidationRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  validator: 'regex' | 'schema' | 'custom';
  schema?: any;
  customValidator?: string;
  severity: 'info' | 'warning' | 'error';
  enabled: boolean;
  lastRun?: string;
}