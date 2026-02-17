/**
 * Sovereign Stack - Core Class
 * 
 * Simple, Powerful, Local-First Digital Sovereignty
 * Java HTML. Simple but fucking POWERFUL. local. sovereign. connect to centralization when needed. a bridge
 * 
 * 💜 With neurodivergent love and style.
 */

import { DigitalSelfCore } from './digital-self-core/digital-self-core.js';
import { LocalFirstStorage } from './storage/local-first-storage.js';
import { CentralizationBridge } from './bridge/centralization-bridge.js';

export class SovereignStack {
  constructor() {
    this.digitalSelfCore = null;
    this.storage = null;
    this.bridge = null;
    this.initialized = false;
    this.state = {
      grounded: false,
      sovereigntyLevel: 0,
      lastCheck: null,
      issues: [],
      recommendations: []
    };
  }

  /**
   * Initialize the Sovereign Stack
   * Why: We need a simple, powerful foundation for digital sovereignty
   */
  async initialize() {
    console.log('💜 Initializing Sovereign Stack Standalone...');
    console.log('💜 Simple but fucking POWERFUL. Local. Sovereign.');
    
    try {
      // 1. Initialize Local-First Storage
      this.storage = new LocalFirstStorage();
      await this.storage.initialize();
      console.log('✅ Local-First Storage Initialized');
      
      // 2. Initialize Digital Self Core
      this.digitalSelfCore = new DigitalSelfCore();
      await this.digitalSelfCore.initialize();
      console.log('✅ Digital Self Core Initialized');
      
      // 3. Initialize Centralization Bridge (optional)
      this.bridge = new CentralizationBridge();
      console.log('✅ Centralization Bridge Ready (connect when needed)');
      
      // 4. Perform Initial Sovereignty Check
      await this.performSovereigntyCheck();
      
      this.initialized = true;
      console.log('💜 Sovereign Stack Standalone Initialized Successfully');
      console.log('💜 "Connect to centralization when needed. A bridge."');
      
      return this.state;
      
    } catch (error) {
      console.error('❌ Sovereign Stack Initialization Failed:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive sovereignty check
   * Why: We need to know our sovereignty status at all times
   */
  async performSovereigntyCheck() {
    console.log('🔍 Performing Sovereignty Check...');
    
    const checkResults = {
      timestamp: new Date().toISOString(),
      components: {},
      issues: [],
      recommendations: []
    };
    
    // Check Digital Self Core Grounding
    try {
      const groundingResult = await this.digitalSelfCore.groundingPhase();
      checkResults.components.digitalSelfCore = groundingResult;
      
      if (groundingResult.grounded) {
        console.log('✅ Digital Self Core: GROUNDED');
        this.state.grounded = true;
      } else {
        console.log('⚠️ Digital Self Core: NOT GROUNDED');
        this.state.grounded = false;
        checkResults.issues.push('Digital Self Core not grounded');
        checkResults.recommendations.push('Execute grounding phase manually');
      }
    } catch (error) {
      console.error('❌ Digital Self Core Check Failed:', error);
      checkResults.issues.push(`Digital Self Core error: ${error.message}`);
    }
    
    // Check Local Storage Health
    try {
      const storageHealth = await this.storage.healthCheck();
      checkResults.components.storage = storageHealth;
      
      if (storageHealth.healthy) {
        console.log('✅ Local Storage: HEALTHY');
      } else {
        console.log('⚠️ Local Storage: ISSUES DETECTED');
        checkResults.issues.push('Local storage issues detected');
        checkResults.recommendations.push(...storageHealth.recommendations || []);
      }
    } catch (error) {
      console.error('❌ Storage Check Failed:', error);
      checkResults.issues.push(`Storage error: ${error.message}`);
    }
    
    // Calculate Sovereignty Level (0-100)
    let sovereigntyScore = 0;
    if (this.state.grounded) sovereigntyScore += 50;
    if (checkResults.components.storage?.healthy) sovereigntyScore += 30;
    if (checkResults.issues.length === 0) sovereigntyScore += 20;
    
    this.state.sovereigntyLevel = sovereigntyScore;
    this.state.lastCheck = checkResults.timestamp;
    this.state.issues = checkResults.issues;
    this.state.recommendations = checkResults.recommendations;
    
    // Store check results
    await this.storage.set('sovereignty-checks', checkResults);
    
    console.log(`📊 Sovereignty Level: ${sovereigntyScore}/100`);
    if (checkResults.issues.length > 0) {
      console.log('⚠️ Issues:', checkResults.issues);
    }
    
    return checkResults;
  }

  /**
   * Get current sovereignty status
   * Why: Quick status check without full diagnostics
   */
  async getStatus() {
    if (!this.initialized) {
      throw new Error('Sovereign Stack not initialized');
    }
    
    return {
      grounded: this.state.grounded,
      sovereigntyLevel: this.state.sovereigntyLevel,
      lastCheck: this.state.lastCheck,
      issues: this.state.issues,
      recommendations: this.state.recommendations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Ground the system (if not already grounded)
   * Why: Sovereignty requires proper grounding
   */
  async ground() {
    console.log('⚡ Executing Grounding Phase...');
    
    if (!this.digitalSelfCore) {
      throw new Error('Digital Self Core not initialized');
    }
    
    const result = await this.digitalSelfCore.groundingPhase();
    
    if (result.grounded) {
      this.state.grounded = true;
      console.log('✅ System Grounded Successfully');
    } else {
      console.log('⚠️ Grounding Failed - Issues:', result.issues);
    }
    
    // Update sovereignty check
    await this.performSovereigntyCheck();
    
    return result;
  }

  /**
   * Store data locally (primary sovereignty storage)
   * Why: Local-first is sovereign-first
   */
  async storeData(key, data, metadata = {}) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    
    const record = {
      data,
      metadata: {
        ...metadata,
        storedAt: new Date().toISOString(),
        sovereigntyLevel: this.state.sovereigntyLevel
      }
    };
    
    await this.storage.set(key, record);
    console.log(`💾 Data stored locally: ${key}`);
    
    return {
      key,
      storedAt: record.metadata.storedAt,
      local: true,
      bridgeAvailable: !!this.bridge
    };
  }

  /**
   * Retrieve data from local storage
   * Why: Access sovereign data without external dependencies
   */
  async retrieveData(key) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    
    const data = await this.storage.get(key);
    
    if (!data) {
      // Optional: Check bridge if data not found locally
      if (this.bridge) {
        console.log(`🔍 Data not found locally, checking bridge for: ${key}`);
        const bridgeData = await this.bridge.retrieve(key);
        if (bridgeData) {
          // Store locally for future sovereignty
          await this.storeData(key, bridgeData.data, {
            ...bridgeData.metadata,
            retrievedFromBridge: true
          });
          return bridgeData;
        }
      }
    }
    
    return data;
  }

  /**
   * Connect to centralization (when needed)
   * Why: A bridge to centralized systems when sovereignty allows
   */
  async connectToCentralization(bridgeType = 'default', options = {}) {
    if (!this.bridge) {
      throw new Error('Bridge not initialized');
    }
    
    console.log(`🌉 Connecting to centralization via ${bridgeType} bridge...`);
    
    // Only connect if sovereignty is stable
    if (this.state.sovereigntyLevel < 70) {
      console.warn('⚠️ Low sovereignty level - bridge connection may compromise sovereignty');
    }
    
    const connection = await this.bridge.connect(bridgeType, options);
    
    // Log bridge usage for sovereignty audit
    await this.storage.set('bridge-usage', {
      timestamp: new Date().toISOString(),
      bridgeType,
      sovereigntyLevel: this.state.sovereigntyLevel,
      connection
    });
    
    console.log(`✅ Connected to ${bridgeType} bridge`);
    
    return connection;
  }

  /**
   * Export sovereignty data (for backup or migration)
   * Why: Sovereign data should be portable
   */
  async exportSovereigntyData(format = 'json') {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    
    console.log(`📤 Exporting sovereignty data in ${format} format...`);
    
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        sovereigntyLevel: this.state.sovereigntyLevel,
        grounded: this.state.grounded,
        format
      },
      sovereigntyChecks: await this.storage.get('sovereignty-checks') || [],
      digitalSelfCore: this.digitalSelfCore?.exportState?.(),
      storageStats: await this.storage.getStats?.(),
      bridgeUsage: await this.storage.get('bridge-usage') || []
    };
    
    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }
    
    return exportData;
  }

  /**
   * Emergency sovereignty lockdown
   * Why: When sovereignty is compromised, lock down and regroup
   */
  async emergencyLockdown() {
    console.log('🚨 EMERGENCY SOVEREIGNTY LOCKDOWN ACTIVATED');
    
    // 1. Disconnect all bridge connections
    if (this.bridge) {
      await this.bridge.disconnectAll();
      console.log('🔒 All bridge connections disconnected');
    }
    
    // 2. Clear sensitive bridge data from local storage
    await this.storage.remove('bridge-usage');
    await this.storage.remove('bridge-cache');
    console.log('🧹 Bridge data cleared from local storage');
    
    // 3. Re-ground the system
    await this.ground();
    console.log('⚡ System re-grounded');
    
    // 4. Perform emergency sovereignty check
    await this.performSovereigntyCheck();
    
    console.log('✅ Emergency lockdown complete');
    console.log('💜 Sovereignty preserved. Regroup. Rebuild.');
    
    return {
      lockedDown: true,
      timestamp: new Date().toISOString(),
      sovereigntyLevel: this.state.sovereigntyLevel
    };
  }

  /**
   * Simple health check
   * Why: Quick check if system is operational
   */
  async healthCheck() {
    return {
      healthy: this.initialized && this.state.grounded,
      components: {
        digitalSelfCore: !!this.digitalSelfCore,
        storage: !!this.storage,
        bridge: !!this.bridge
      },
      sovereigntyLevel: this.state.sovereigntyLevel,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Destroy and clean up
   * Why: Clean shutdown preserves sovereignty integrity
   */
  async destroy() {
    console.log('🧹 Cleaning up Sovereign Stack...');
    
    if (this.bridge) {
      await this.bridge.disconnectAll();
    }
    
    // Note: Local storage persists - that's the point of sovereignty
    
    this.initialized = false;
    console.log('✅ Sovereign Stack cleaned up');
    console.log('💜 Local data preserved. Sovereignty intact.');
  }
}