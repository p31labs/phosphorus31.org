/**
 * Local-First Storage
 * 
 * Simple, powerful local storage for sovereign data
 * Uses localStorage with fallback to in-memory storage
 * 
 * 💜 With neurodivergent love and style.
 */

export class LocalFirstStorage {
  constructor() {
    this.storage = null;
    this.memoryStore = new Map();
    this.initialized = false;
    this.prefix = 'sovereign-stack-';
  }

  /**
   * Initialize storage
   * Why: We need reliable local storage for sovereignty
   */
  async initialize() {
    console.log('💾 Initializing Local-First Storage...');
    
    try {
      // Try to use localStorage (browser environment)
      if (typeof localStorage !== 'undefined') {
        this.storage = localStorage;
        console.log('✅ Using browser localStorage');
      } 
      // Try to use node-localstorage (Node.js environment)
      else if (typeof require !== 'undefined') {
        try {
          const { LocalStorage } = require('node-localstorage');
          const path = require('path');
          const storagePath = path.join(process.cwd(), '.sovereign-storage');
          this.storage = new LocalStorage(storagePath);
          console.log('✅ Using node-localstorage at', storagePath);
        } catch (error) {
          console.warn('⚠️ node-localstorage not available, using in-memory storage');
          this.storage = null;
        }
      }
      
      // If no persistent storage available, use in-memory
      if (!this.storage) {
        console.log('⚠️ No persistent storage available, using in-memory storage');
        console.log('⚠️ Data will be lost on restart');
      }
      
      this.initialized = true;
      console.log('✅ Local-First Storage Initialized');
      
      return true;
    } catch (error) {
      console.error('❌ Storage Initialization Failed:', error);
      // Fall back to in-memory storage
      this.storage = null;
      this.initialized = true;
      console.log('⚠️ Using in-memory storage as fallback');
      return true;
    }
  }

  /**
   * Get storage key with prefix
   * Why: Prevent namespace collisions
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Set data in storage
   * Why: Store sovereign data locally
   */
  async set(key, value) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const storageKey = this.getKey(key);
    const serialized = JSON.stringify({
      data: value,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    
    if (this.storage) {
      try {
        this.storage.setItem(storageKey, serialized);
      } catch (error) {
        // Storage may be full or unavailable
        console.warn('⚠️ Persistent storage failed, using in-memory:', error);
        this.memoryStore.set(storageKey, serialized);
      }
    } else {
      this.memoryStore.set(storageKey, serialized);
    }
    
    return {
      key,
      storedAt: new Date().toISOString(),
      size: serialized.length
    };
  }

  /**
   * Get data from storage
   * Why: Retrieve sovereign data without external dependencies
   */
  async get(key) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const storageKey = this.getKey(key);
    let serialized = null;
    
    if (this.storage) {
      try {
        serialized = this.storage.getItem(storageKey);
      } catch (error) {
        console.warn('⚠️ Persistent storage read failed, checking memory:', error);
        serialized = this.memoryStore.get(storageKey) || null;
      }
    } else {
      serialized = this.memoryStore.get(storageKey) || null;
    }
    
    if (!serialized) {
      return null;
    }
    
    try {
      const parsed = JSON.parse(serialized);
      return parsed.data;
    } catch (error) {
      console.error('❌ Failed to parse stored data:', error);
      return null;
    }
  }

  /**
   * Remove data from storage
   * Why: Delete sovereign data when needed
   */
  async remove(key) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const storageKey = this.getKey(key);
    
    if (this.storage) {
      try {
        this.storage.removeItem(storageKey);
      } catch (error) {
        console.warn('⚠️ Persistent storage remove failed, removing from memory:', error);
      }
    }
    
    this.memoryStore.delete(storageKey);
    
    return {
      key,
      removedAt: new Date().toISOString()
    };
  }

  /**
   * Check if key exists in storage
   * Why: Quick check without retrieving full data
   */
  async has(key) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const storageKey = this.getKey(key);
    
    if (this.storage) {
      try {
        return this.storage.getItem(storageKey) !== null;
      } catch (error) {
        return this.memoryStore.has(storageKey);
      }
    }
    
    return this.memoryStore.has(storageKey);
  }

  /**
   * Get all keys in storage
   * Why: Discover what data is stored
   */
  async keys() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const allKeys = [];
    
    if (this.storage) {
      try {
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key.startsWith(this.prefix)) {
            allKeys.push(key.substring(this.prefix.length));
          }
        }
      } catch (error) {
        console.warn('⚠️ Persistent storage keys failed, using memory keys:', error);
      }
    }
    
    // Add memory store keys (they already have prefix)
    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(this.prefix)) {
        allKeys.push(key.substring(this.prefix.length));
      }
    }
    
    // Remove duplicates
    return [...new Set(allKeys)];
  }

  /**
   * Clear all sovereign data from storage
   * Why: Complete data wipe when needed
   */
  async clear() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    console.log('🧹 Clearing all sovereign data from storage...');
    
    // Clear persistent storage
    if (this.storage) {
      try {
        const keysToRemove = [];
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          this.storage.removeItem(key);
        });
        
        console.log(`✅ Cleared ${keysToRemove.length} items from persistent storage`);
      } catch (error) {
        console.error('❌ Failed to clear persistent storage:', error);
      }
    }
    
    // Clear memory store
    const memoryKeys = [];
    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(this.prefix)) {
        memoryKeys.push(key);
      }
    }
    
    memoryKeys.forEach(key => {
      this.memoryStore.delete(key);
    });
    
    console.log(`✅ Cleared ${memoryKeys.length} items from memory storage`);
    
    return {
      clearedAt: new Date().toISOString(),
      persistentItems: this.storage ? memoryKeys.length : 0,
      memoryItems: memoryKeys.length
    };
  }

  /**
   * Get storage statistics
   * Why: Monitor storage usage and health
   */
  async getStats() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const keys = await this.keys();
    let totalSize = 0;
    const items = [];
    
    for (const key of keys) {
      const data = await this.get(key);
      if (data) {
        const size = JSON.stringify(data).length;
        totalSize += size;
        items.push({
          key,
          size,
          hasData: true
        });
      } else {
        items.push({
          key,
          size: 0,
          hasData: false
        });
      }
    }
    
    return {
      totalKeys: keys.length,
      totalSize,
      items,
      storageType: this.storage ? 'persistent' : 'memory',
      initialized: this.initialized,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Health check
   * Why: Ensure storage is working properly
   */
  async healthCheck() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const testKey = this.getKey('health-check');
    const testValue = { test: true, timestamp: new Date().toISOString() };
    
    try {
      // Test write
      await this.set('health-check', testValue);
      
      // Test read
      const retrieved = await this.get('health-check');
      
      // Test delete
      await this.remove('health-check');
      
      const healthy = retrieved && retrieved.test === true;
      
      return {
        healthy,
        storageType: this.storage ? 'persistent' : 'memory',
        writeSuccess: true,
        readSuccess: !!retrieved,
        deleteSuccess: true,
        message: healthy ? 'Storage healthy' : 'Storage test failed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        healthy: false,
        storageType: this.storage ? 'persistent' : 'memory',
        error: error.message,
        message: 'Storage health check failed',
        timestamp: new Date().toISOString(),
        recommendations: [
          'Check storage permissions',
          'Clear browser storage if in browser',
          'Ensure disk space is available'
        ]
      };
    }
  }

  /**
   * Export all data
   * Why: Backup or migrate sovereign data
   */
  async exportAll() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const keys = await this.keys();
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalKeys: keys.length,
        sovereignStackVersion: '1.0.0'
      },
      data: {}
    };
    
    for (const key of keys) {
      const data = await this.get(key);
      if (data) {
        exportData.data[key] = data;
      }
    }
    
    return exportData;
  }

  /**
   * Import data
   * Why: Restore from backup or migrate
   */
  async importData(importData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    console.log('📥 Importing data into local storage...');
    
    const importedKeys = [];
    const skippedKeys = [];
    
    if (importData.data && typeof importData.data === 'object') {
      for (const [key, value] of Object.entries(importData.data)) {
        try {
          await this.set(key, value);
          importedKeys.push(key);
        } catch (error) {
          console.warn(`⚠️ Failed to import key ${key}:`, error);
          skippedKeys.push(key);
        }
      }
    }
    
    return {
      importedKeys,
      skippedKeys,
      totalImported: importedKeys.length,
      totalSkipped: skippedKeys.length,
      timestamp: new Date().toISOString()
    };
  }
}