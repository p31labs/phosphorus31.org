/n my **
 * Analysis Type Definitions
 * 
 * Defines types for project analysis, code quality, and system insights.
 */

export interface ProjectAnalysis {
  timestamp: string;
  projectPath: string;
  structure: any;
  codeQuality: CodeQualityMetrics;
  dependencies: DependencyAnalysis;
  architecture: any;
  security: any;
  performance: any;
  summary: AnalysisSummary;
}

export interface CodeQualityMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  testCoverage: number;
  codeSmells: string[];
  issues: string[];
}

export interface DependencyAnalysis {
  packageManagers: PackageManagerInfo[];
  outdatedDependencies: DependencyInfo[];
  securityVulnerabilities: SecurityVulnerability[];
  circularDependencies: string[];
  dependencyHealth: Record<string, DependencyHealth>;
}

export interface PackageManagerInfo {
  type: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'maven' | 'gradle' | 'cargo' | 'go' | 'rubygems';
  path: string;
  dependencies: string[];
  devDependencies: string[];
  version: string;
  lockfile?: string;
}

export interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  outdatedBy: string;
  securityIssues: number;
  lastUpdated: string;
  url?: string;
}

export interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  affectedPackage: string;
  affectedVersion: string;
  fixedVersion?: string;
  cwe?: string[];
  cvss?: {
    score: number;
    vector: string;
  };
  references: string[];
  published: string;
  updated: string;
}

export interface DependencyHealth {
  status: 'healthy' | 'outdated' | 'vulnerable' | 'unknown';
  lastCheck: string;
  issues: string[];
  recommendations: string[];
}

export interface ArchitectureAnalysis {
  detectedPatterns: string[];
  architecturalDecisions: string[];
  violations: string[];
  recommendations: string[];
  complexity: {
    coupling: number;
    cohesion: number;
    depth: number;
    width: number;
  };
  modularity: {
    modules: number;
    interfaces: number;
    dependencies: number;
    cyclicDependencies: number;
  };
}

export interface SecurityAnalysis {
  vulnerabilities: string[];
  sensitiveFiles: string[];
  weakPatterns: string[];
  recommendations: string[];
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    mitigationStrategies: string[];
  };
}

export interface PerformanceAnalysis {
  bottlenecks: string[];
  optimizationOpportunities: string[];
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  recommendations: string[];
  benchmarks: BenchmarkResult[];
}

export interface BenchmarkResult {
  name: string;
  category: string;
  value: number;
  unit: string;
  baseline?: number;
  threshold?: number;
  status: 'pass' | 'warn' | 'fail';
  timestamp: string;
}

export interface AnalysisSummary {
  overallHealth: number;
  criticalIssues: string[];
  improvementPriority: string[];
  lastUpdated: string;
  confidence: number;
  recommendations: AnalysisRecommendation[];
}

export interface AnalysisRecommendation {
  id: string;
  category: 'code-quality' | 'dependencies' | 'architecture' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  effort: 'trivial' | 'easy' | 'medium' | 'hard' | 'very-hard';
  estimatedTime: string;
  affectedFiles: string[];
  tags: string[];
}

export interface CodeSmell {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line: number;
  description: string;
  pattern: string;
  suggestion: string;
  category: 'complexity' | 'duplication' | 'naming' | 'structure' | 'performance' | 'security';
}

export interface TechnicalDebt {
  id: string;
  type: 'code-smell' | 'outdated-dependency' | 'security-vulnerability' | 'architecture-violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  file?: string;
  line?: number;
  effort: number; // in hours
  impact: 'low' | 'medium' | 'high';
  created: string;
  tags: string[];
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  halsteadComplexity: {
    volume: number;
    difficulty: number;
    effort: number;
    bugs: number;
  };
  nestingDepth: number;
  fanIn: number;
  fanOut: number;
  cognitiveComplexity: number;
}

export interface TestCoverage {
  lines: {
    covered: number;
    total: number;
    percentage: number;
  };
  branches: {
    covered: number;
    total: number;
    percentage: number;
  };
  functions: {
    covered: number;
    total: number;
    percentage: number;
  };
  statements: {
    covered: number;
    total: number;
    percentage: number;
  };
  files: string[];
  uncoveredLines: Array<{
    file: string;
    line: number;
    statement: string;
  }>;
}

export interface CodeDuplication {
  id: string;
  files: string[];
  lines: number;
  percentage: number;
  similarity: number;
  blocks: Array<{
    file: string;
    startLine: number;
    endLine: number;
    code: string;
  }>;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  clusters: DependencyCluster[];
}

export interface DependencyNode {
  id: string;
  name: string;
  version: string;
  type: 'package' | 'file' | 'module';
  size?: number;
  color?: string;
  metadata: Record<string, any>;
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'import' | 'require' | 'dependency' | 'devDependency';
  weight: number;
  metadata: Record<string, any>;
}

export interface DependencyCluster {
  id: string;
  name: string;
  nodes: string[];
  type: 'module' | 'feature' | 'layer';
  metadata: Record<string, any>;
}

export interface ArchitecturePattern {
  name: string;
  type: 'structural' | 'creational' | 'behavioral' | 'architectural';
  description: string;
  benefits: string[];
  tradeoffs: string[];
  detected: boolean;
  confidence: number;
  files: string[];
  violations: ArchitectureViolation[];
}

export interface ArchitectureViolation {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  description: string;
  file: string;
  line?: number;
  pattern: string;
  suggestion: string;
}

export interface SecurityScanResult {
  vulnerabilities: SecurityVulnerability[];
  issues: SecurityIssue[];
  recommendations: string[];
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  file: string;
  line?: number;
  cwe?: string;
  owasp?: string;
  suggestion: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  baseline?: number;
  trend: 'improving' | 'stable' | 'degrading';
  category: 'cpu' | 'memory' | 'disk' | 'network' | 'io';
}

export interface ResourceUsage {
  cpu: {
    usage: number;
    peak: number;
    average: number;
    threshold: number;
  };
  memory: {
    usage: number;
    peak: number;
    average: number;
    threshold: number;
    leaks?: MemoryLeak[];
  };
  disk: {
    usage: number;
    iops: number;
    throughput: number;
    threshold: number;
  };
  network: {
    usage: number;
    requests: number;
    errors: number;
    threshold: number;
  };
}

export interface MemoryLeak {
  id: string;
  type: string;
  file: string;
  line?: number;
  description: string;
  size: number;
  growthRate: number;
  suggestion: string;
}

export interface CodeReview {
  id: string;
  file: string;
  issues: CodeIssue[];
  suggestions: string[];
  complexity: number;
  maintainability: number;
  security: number;
  performance: number;
}

export interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  line: number;
  column: number;
  message: string;
  rule: string;
  suggestion?: string;
}

export interface ProjectHealth {
  overall: number;
  categories: {
    codeQuality: number;
    dependencies: number;
    security: number;
    performance: number;
    architecture: number;
  };
  trends: HealthTrend[];
  recommendations: AnalysisRecommendation[];
}

export interface HealthTrend {
  category: string;
  current: number;
  previous: number;
  change: number;
  trend: 'improving' | 'stable' | 'degrading';
  timestamp: string;
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  project: string;
  version: string;
  duration: number;
  metrics: ProjectAnalysis;
  summary: AnalysisSummary;
  recommendations: AnalysisRecommendation[];
  export: {
    format: 'json' | 'html' | 'pdf' | 'xml';
    path: string;
    timestamp: string;
  };
}