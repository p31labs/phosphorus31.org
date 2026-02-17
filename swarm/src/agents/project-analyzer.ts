/**
 * Project Analyzer Agent
 * 
 * Provides deep analysis of project structure, dependencies, code quality,
 * architecture patterns, and potential improvements.
 */

import { EventEmitter } from 'events';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { Logger } from '../utils/logger';
import { SwarmConfig } from '../config/swarm-config';
import { AgentTask, AgentStatus } from '../types/agent-types';
import { ProjectAnalysis, CodeQualityMetrics, DependencyAnalysis } from '../types/analysis-types';
import { FileChange } from '../types/file-system-types';

export class ProjectAnalyzer extends EventEmitter {
  private config: SwarmConfig;
  private logger: Logger;
  private projectPath: string;
  private isRunning: boolean = false;
  private status: AgentStatus;
  private analysisCache: Map<string, ProjectAnalysis> = new Map();
  private lastAnalysisTime: Date | null = null;

  // Analysis results
  private currentAnalysis: ProjectAnalysis | null = null;
  private codeQuality: CodeQualityMetrics | null = null;
  private dependencies: DependencyAnalysis | null = null;

  constructor(config: SwarmConfig, logger: Logger, projectPath: string) {
    super();
    this.config = config;
    this.logger = logger;
    this.projectPath = projectPath;
    this.status = {
      name: 'project-analyzer',
      status: 'initialized',
      lastUpdate: new Date().toISOString(),
      performance: { cpu: 0, memory: 0, uptime: 0 },
      metrics: { analysesPerformed: 0, filesAnalyzed: 0, issuesFound: 0 }
    };
  }

  /**
   * Initialize the project analyzer
   */
  public async initialize(): Promise<void> {
    this.logger.info('🔍 Initializing Project Analyzer...');
    
    try {
      // Load analysis configuration
      await this.loadAnalysisConfig();
      
      this.status.status = 'ready';
      this.status.lastUpdate = new Date().toISOString();
      
      this.logger.success('✅ Project Analyzer initialized');
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize Project Analyzer:', error);
      this.status.status = 'error';
      throw error;
    }
  }

  /**
   * Start the analyzer
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Project Analyzer is already running');
      return;
    }

    this.isRunning = true;
    this.status.status = 'running';
    this.status.lastUpdate = new Date().toISOString();

    this.logger.info('📊 Starting Project Analyzer...');

    // Schedule periodic analysis
    const analysisInterval = this.config.get('analysis.interval', 300000); // 5 minutes
    
    setInterval(async () => {
      if (this.isRunning) {
        await this.performAnalysis();
      }
    }, analysisInterval);

    this.logger.success('✅ Project Analyzer started');
  }

  /**
   * Stop the analyzer
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Project Analyzer is not running');
      return;
    }

    this.isRunning = false;
    this.status.status = 'stopped';
    this.status.lastUpdate = new Date().toISOString();

    this.logger.info('🛑 Stopping Project Analyzer...');
    this.logger.success('✅ Project Analyzer stopped');
  }

  /**
   * Emergency stop
   */
  public async emergencyStop(): Promise<void> {
    this.isRunning = false;
    this.status.status = 'emergency-stopped';
  }

  /**
   * Execute analysis task
   */
  public async execute(task?: AgentTask): Promise<any> {
    this.logger.info('🎯 Executing Project Analyzer task...');

    try {
      switch (task?.type) {
        case 'full-analysis':
          return await this.performFullAnalysis();
        case 'code-quality':
          return await this.analyzeCodeQuality();
        case 'dependencies':
          return await this.analyzeDependencies();
        case 'architecture':
          return await this.analyzeArchitecture();
        case 'security':
          return await this.analyzeSecurity();
        default:
          return await this.performAnalysis();
      }
    } catch (error) {
      this.logger.error('❌ Project Analyzer execution failed:', error);
      this.status.metrics.errors++;
      throw error;
    }
  }

  /**
   * Schedule analysis task
   */
  public async scheduleTask(task: AgentTask): Promise<void> {
    this.logger.info(`📅 Scheduling analysis task: ${task.type}`);
    await this.execute(task);
  }

  /**
   * Get current status
   */
  public getStatus(): AgentStatus {
    return { ...this.status };
  }

  /**
   * Get current analysis
   */
  public getCurrentAnalysis(): ProjectAnalysis | null {
    return this.currentAnalysis;
  }

  /**
   * Get code quality metrics
   */
  public getCodeQuality(): CodeQualityMetrics | null {
    return this.codeQuality;
  }

  /**
   * Get dependency analysis
   */
  public getDependencies(): DependencyAnalysis | null {
    return this.dependencies;
  }

  /**
   * Perform full project analysis
   */
  public async performFullAnalysis(): Promise<ProjectAnalysis> {
    this.logger.info('🔍 Performing full project analysis...');

    const startTime = Date.now();
    
    try {
      // Perform all analysis types
      const structure = await this.analyzeProjectStructure();
      const codeQuality = await this.analyzeCodeQuality();
      const dependencies = await this.analyzeDependencies();
      const architecture = await this.analyzeArchitecture();
      const security = await this.analyzeSecurity();
      const performance = await this.analyzePerformance();

      const analysis: ProjectAnalysis = {
        timestamp: new Date().toISOString(),
        projectPath: this.projectPath,
        structure,
        codeQuality,
        dependencies,
        architecture,
        security,
        performance,
        summary: this.generateSummary(structure, codeQuality, dependencies, architecture, security, performance)
      };

      this.currentAnalysis = analysis;
      this.lastAnalysisTime = new Date();
      this.status.metrics.analysesPerformed++;
      this.status.lastUpdate = new Date().toISOString();

      const analysisTime = Date.now() - startTime;
      this.logger.success(`✅ Full analysis completed in ${analysisTime}ms`);

      this.emit('analysis-complete', analysis);
      this.emit('status-update', this.getStatus());

      return analysis;

    } catch (error) {
      this.logger.error('❌ Full analysis failed:', error);
      this.status.metrics.errors++;
      throw error;
    }
  }

  /**
   * Perform quick analysis
   */
  public async performAnalysis(): Promise<ProjectAnalysis> {
    return await this.performFullAnalysis();
  }

  /**
   * Analyze project structure
   */
  private async analyzeProjectStructure(): Promise<any> {
    this.logger.info('🏗️  Analyzing project structure...');

    const structure = {
      directories: new Map<string, number>(),
      files: new Map<string, number>(),
      fileTypes: new Map<string, number>(),
      totalFiles: 0,
      totalSize: 0,
      largestFiles: [] as Array<{ path: string; size: number }>,
      deepestPath: { path: '', depth: 0 }
    };

    const files = await this.getAllFiles();
    structure.totalFiles = files.length;

    for (const filePath of files) {
      const stats = await fs.stat(filePath);
      const relativePath = path.relative(this.projectPath, filePath);
      const depth = relativePath.split(path.sep).length;
      
      structure.totalSize += stats.size;
      
      // Track largest files
      if (structure.largestFiles.length < 10) {
        structure.largestFiles.push({ path: relativePath, size: stats.size });
        structure.largestFiles.sort((a, b) => b.size - a.size);
      } else if (stats.size > structure.largestFiles[9].size) {
        structure.largestFiles[9] = { path: relativePath, size: stats.size };
        structure.largestFiles.sort((a, b) => b.size - a.size);
      }

      // Track deepest path
      if (depth > structure.deepestPath.depth) {
        structure.deepestPath = { path: relativePath, depth };
      }

      // Count by directory
      const dir = path.dirname(relativePath);
      structure.directories.set(dir, (structure.directories.get(dir) || 0) + 1);

      // Count by file type
      const ext = path.extname(filePath) || 'no-extension';
      structure.fileTypes.set(ext, (structure.fileTypes.get(ext) || 0) + 1);
    }

    return {
      totalFiles: structure.totalFiles,
      totalSize: structure.totalSize,
      directories: Object.fromEntries(structure.directories),
      fileTypes: Object.fromEntries(structure.fileTypes),
      largestFiles: structure.largestFiles,
      deepestPath: structure.deepestPath,
      averageFileSize: structure.totalFiles > 0 ? structure.totalSize / structure.totalFiles : 0
    };
  }

  /**
   * Analyze code quality
   */
  private async analyzeCodeQuality(): Promise<CodeQualityMetrics> {
    this.logger.info('📈 Analyzing code quality...');

    const metrics: CodeQualityMetrics = {
      totalLines: 0,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
      cyclomaticComplexity: 0,
      maintainabilityIndex: 0,
      testCoverage: 0,
      codeSmells: [],
      issues: []
    };

    const sourceFiles = await this.getSourceFiles();
    
    for (const filePath of sourceFiles) {
      const content = await fs.readFile(filePath, 'utf8');
      const fileMetrics = this.analyzeFileQuality(content, filePath);
      
      metrics.totalLines += fileMetrics.totalLines;
      metrics.codeLines += fileMetrics.codeLines;
      metrics.commentLines += fileMetrics.commentLines;
      metrics.blankLines += fileMetrics.blankLines;
      metrics.cyclomaticComplexity += fileMetrics.cyclomaticComplexity;
    }

    // Calculate maintainability index
    if (metrics.totalLines > 0) {
      const halsteadVolume = this.calculateHalsteadVolume(sourceFiles);
      const mi = 171 - 5.2 * Math.log(halsteadVolume) - 0.23 * metrics.cyclomaticComplexity - 16.2 * Math.log(metrics.codeLines);
      metrics.maintainabilityIndex = Math.max(0, Math.min(100, mi));
    }

    // Check for common code smells
    metrics.codeSmells = await this.detectCodeSmells(sourceFiles);

    this.codeQuality = metrics;
    return metrics;
  }

  /**
   * Analyze dependencies
   */
  private async analyzeDependencies(): Promise<DependencyAnalysis> {
    this.logger.info('🔗 Analyzing dependencies...');

    const analysis: DependencyAnalysis = {
      packageManagers: [],
      outdatedDependencies: [],
      securityVulnerabilities: [],
      circularDependencies: [],
      dependencyHealth: {}
    };

    // Find package.json files
    const packageFiles = await glob.glob('**/package.json', { cwd: this.projectPath });
    
    for (const packageFile of packageFiles) {
      const packagePath = path.join(this.projectPath, packageFile);
      const packageJson = await fs.readJson(packagePath);
      
      analysis.packageManagers.push({
        type: 'npm',
        path: packageFile,
        dependencies: Object.keys(packageJson.dependencies || {}),
        devDependencies: Object.keys(packageJson.devDependencies || {}),
        version: packageJson.version
      });
    }

    // Check for outdated dependencies
    analysis.outdatedDependencies = await this.checkOutdatedDependencies(packageFiles);

    // Check for security vulnerabilities
    analysis.securityVulnerabilities = await this.checkSecurityVulnerabilities(packageFiles);

    this.dependencies = analysis;
    return analysis;
  }

  /**
   * Analyze architecture patterns
   */
  private async analyzeArchitecture(): Promise<any> {
    this.logger.info('🏗️  Analyzing architecture patterns...');

    const patterns = {
      detectedPatterns: [] as string[],
      architecturalDecisions: [] as string[],
      violations: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze directory structure for common patterns
    const structure = await this.analyzeProjectStructure();
    
    // Check for MVC pattern
    if (structure.directories['src/controllers'] && structure.directories['src/models'] && structure.directories['src/views']) {
      patterns.detectedPatterns.push('MVC');
    }

    // Check for layered architecture
    if (structure.directories['src/services'] && structure.directories['src/repositories'] && structure.directories['src/models']) {
      patterns.detectedPatterns.push('Layered');
    }

    // Check for microservices pattern
    if (structure.directories['services']) {
      patterns.detectedPatterns.push('Microservices');
    }

    // Generate recommendations
    if (!patterns.detectedPatterns.length) {
      patterns.recommendations.push('Consider implementing a clear architectural pattern (MVC, Layered, etc.)');
    }

    return patterns;
  }

  /**
   * Analyze security
   */
  private async analyzeSecurity(): Promise<any> {
    this.logger.info('🔒 Analyzing security...');

    const security = {
      vulnerabilities: [] as string[],
      sensitiveFiles: [] as string[],
      weakPatterns: [] as string[],
      recommendations: [] as string[]
    };

    // Check for sensitive files
    const sensitiveFiles = await this.findSensitiveFiles();
    security.sensitiveFiles = sensitiveFiles;

    // Check for weak patterns in code
    const sourceFiles = await this.getSourceFiles();
    security.weakPatterns = await this.detectSecurityPatterns(sourceFiles);

    // Generate security recommendations
    if (security.sensitiveFiles.length > 0) {
      security.recommendations.push('Consider securing sensitive files with proper access controls');
    }

    return security;
  }

  /**
   * Analyze performance
   */
  private async analyzePerformance(): Promise<any> {
    this.logger.info('⚡ Analyzing performance...');

    const performance = {
      bottlenecks: [] as string[],
      optimizationOpportunities: [] as string[],
      resourceUsage: {} as any
    };

    // Analyze file sizes
    const files = await this.getAllFiles();
    const largeFiles = files.filter(async (file) => {
      const stats = await fs.stat(file);
      return stats.size > 1024 * 1024; // Files larger than 1MB
    });

    if (largeFiles.length > 0) {
      performance.bottlenecks.push(`Found ${largeFiles.length} large files that may impact performance`);
    }

    return performance;
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(structure: any, codeQuality: CodeQualityMetrics, dependencies: DependencyAnalysis, architecture: any, security: any, performance: any): any {
    return {
      overallHealth: this.calculateOverallHealth(codeQuality, dependencies, security),
      criticalIssues: this.identifyCriticalIssues(codeQuality, dependencies, security),
      improvementPriority: this.calculateImprovementPriority(codeQuality, dependencies, architecture),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate overall health score
   */
  private calculateOverallHealth(codeQuality: CodeQualityMetrics, dependencies: DependencyAnalysis, security: any): number {
    let score = 100;

    // Deduct points for issues
    score -= codeQuality.codeSmells.length * 2;
    score -= dependencies.outdatedDependencies.length;
    score -= security.vulnerabilities.length * 5;
    score -= security.sensitiveFiles.length;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Identify critical issues
   */
  private identifyCriticalIssues(codeQuality: CodeQualityMetrics, dependencies: DependencyAnalysis, security: any): string[] {
    const issues: string[] = [];

    if (codeQuality.maintainabilityIndex < 50) {
      issues.push('Low maintainability index');
    }

    if (dependencies.outdatedDependencies.length > 10) {
      issues.push('Many outdated dependencies');
    }

    if (security.vulnerabilities.length > 0) {
      issues.push('Security vulnerabilities detected');
    }

    return issues;
  }

  /**
   * Calculate improvement priority
   */
  private calculateImprovementPriority(codeQuality: CodeQualityMetrics, dependencies: DependencyAnalysis, architecture: any): string[] {
    const priorities: string[] = [];

    if (codeQuality.maintainabilityIndex < 70) {
      priorities.push('Code quality improvements');
    }

    if (dependencies.outdatedDependencies.length > 5) {
      priorities.push('Dependency updates');
    }

    if (!architecture.detectedPatterns.length) {
      priorities.push('Architecture design');
    }

    return priorities;
  }

  /**
   * Analyze individual file quality
   */
  private analyzeFileQuality(content: string, filePath: string): any {
    const lines = content.split('\n');
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let cyclomaticComplexity = 1; // Base complexity

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed === '') {
        blankLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('///')) {
        commentLines++;
      } else {
        codeLines++;
        
        // Simple cyclomatic complexity calculation
        if (trimmed.includes('if') || trimmed.includes('while') || trimmed.includes('for') || trimmed.includes('case')) {
          cyclomaticComplexity++;
        }
      }
    }

    return {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines,
      cyclomaticComplexity
    };
  }

  /**
   * Calculate Halstead volume
   */
  private async calculateHalsteadVolume(files: string[]): Promise<number> {
    let uniqueOperators = new Set<string>();
    let uniqueOperands = new Set<string>();
    let totalOperators = 0;
    let totalOperands = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const tokens = this.tokenizeCode(content);
      
      for (const token of tokens) {
        if (this.isOperator(token)) {
          uniqueOperators.add(token);
          totalOperators++;
        } else {
          uniqueOperands.add(token);
          totalOperands++;
        }
      }
    }

    const n1 = uniqueOperators.size;
    const n2 = uniqueOperands.size;
    const N1 = totalOperators;
    const N2 = totalOperands;

    const volume = (n1 + n2) * Math.log2(n1 + n2);
    return volume;
  }

  /**
   * Tokenize code for analysis
   */
  private tokenizeCode(content: string): string[] {
    // Simple tokenizer - in a real implementation, you'd use a proper parser
    return content.split(/[\s\(\)\{\}\[\];,.]/).filter(token => token.length > 0);
  }

  /**
   * Check if token is an operator
   */
  private isOperator(token: string): boolean {
    const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>'];
    return operators.includes(token);
  }

  /**
   * Detect code smells
   */
  private async detectCodeSmells(files: string[]): Promise<string[]> {
    const smells: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      
      if (content.length > 10000) {
        smells.push(`Large file: ${file}`);
      }

      if (content.includes('TODO') || content.includes('FIXME')) {
        smells.push(`Technical debt in: ${file}`);
      }
    }

    return smells;
  }

  /**
   * Check for outdated dependencies
   */
  private async checkOutdatedDependencies(packageFiles: string[]): Promise<any[]> {
    // This would integrate with npm audit or similar tools
    return [];
  }

  /**
   * Check for security vulnerabilities
   */
  private async checkSecurityVulnerabilities(packageFiles: string[]): Promise<any[]> {
    // This would integrate with security scanning tools
    return [];
  }

  /**
   * Find sensitive files
   */
  private async findSensitiveFiles(): Promise<string[]> {
    const sensitivePatterns = ['*.key', '*.pem', '*.p12', '*.env', '*.secret'];
    const sensitiveFiles: string[] = [];

    for (const pattern of sensitivePatterns) {
      const files = await glob.glob(pattern, { cwd: this.projectPath });
      sensitiveFiles.push(...files);
    }

    return sensitiveFiles;
  }

  /**
   * Detect security patterns
   */
  private async detectSecurityPatterns(files: string[]): Promise<string[]> {
    const patterns: string[] = [];
    const weakPatterns = ['password', 'secret', 'key', 'token'];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      
      for (const pattern of weakPatterns) {
        if (content.toLowerCase().includes(pattern)) {
          patterns.push(`Potential security issue in ${file}: contains '${pattern}'`);
        }
      }
    }

    return patterns;
  }

  /**
   * Get all files in project
   */
  private async getAllFiles(): Promise<string[]> {
    const files = await glob.glob('**/*', { 
      cwd: this.projectPath, 
      nodir: true,
      ignore: this.config.get('analysis.ignorePatterns', ['**/node_modules/**', '**/.git/**'])
    });
    
    return files.map(file => path.join(this.projectPath, file));
  }

  /**
   * Get source files for analysis
   */
  private async getSourceFiles(): Promise<string[]> {
    const patterns = ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx', '**/*.py', '**/*.java', '**/*.go'];
    const files: string[] = [];

    for (const pattern of patterns) {
      const matchingFiles = await glob.glob(pattern, { 
        cwd: this.projectPath,
        ignore: this.config.get('analysis.ignorePatterns', ['**/node_modules/**', '**/.git/**'])
      });
      files.push(...matchingFiles.map(file => path.join(this.projectPath, file)));
    }

    return files;
  }

  /**
   * Load analysis configuration
   */
  private async loadAnalysisConfig(): Promise<void> {
    // Load configuration for analysis parameters
    const configPath = path.join(this.projectPath, '.swarm', 'analysis-config.json');
    
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      this.config.merge(config);
    }
  }
}