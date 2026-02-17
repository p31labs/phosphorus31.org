/**
 * Module Types (Stub)
 * TODO: Implement full module type definitions
 */

export interface GeodesicModule {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  enabled?: boolean;
  [key: string]: any;
}

export interface ModuleMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  [key: string]: any;
}

export interface ModuleVersion {
  version: string;
  changelog?: string;
  [key: string]: any;
}

export type ModulePermission =
  | 'read:heartbeat'
  | 'read:shield'
  | 'write:shield'
  | 'read:buffer'
  | 'write:buffer';

export interface VibeCoderRequest {
  code: string;
  context?: Record<string, any>;
}

export interface VibeCoderResponse {
  result: any;
  errors?: string[];
  warnings?: string[];
}
