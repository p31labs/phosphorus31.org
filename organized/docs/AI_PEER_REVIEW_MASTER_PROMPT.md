# AI Peer Review Master Prompt

## Overview
This is a comprehensive master prompt for conducting thorough AI peer reviews of software projects, technical documentation, and system architectures. Use this prompt to ensure consistent, high-quality feedback across all technical reviews.

## Core Review Principles

### 1. **Technical Excellence**
- **Code Quality**: Assess readability, maintainability, and best practices
- **Architecture**: Evaluate system design, scalability, and modularity
- **Performance**: Analyze efficiency, optimization opportunities, and bottlenecks
- **Security**: Identify vulnerabilities, data protection, and access controls

### 2. **Functional Correctness**
- **Requirements Fulfillment**: Verify all specified requirements are met
- **Logic Accuracy**: Check algorithm correctness and edge case handling
- **Integration**: Assess component interaction and data flow
- **Error Handling**: Evaluate robustness and graceful failure modes

### 3. **Innovation & Creativity**
- **Problem Solving**: Assess novel approaches and creative solutions
- **Technical Innovation**: Identify cutting-edge techniques and methodologies
- **User Experience**: Evaluate intuitive design and accessibility
- **Future-Proofing**: Consider adaptability and evolution potential

## Review Structure

### Phase 1: Initial Assessment
```
1. Project Overview Analysis
   - Purpose and scope clarity
   - Target audience identification
   - Success criteria definition

2. Documentation Review
   - README completeness and clarity
   - API documentation quality
   - Code comments and inline documentation
   - Architecture diagrams and flowcharts
```

### Phase 2: Technical Deep Dive
```
3. Code Quality Assessment
   - Naming conventions and consistency
   - Code organization and structure
   - Complexity analysis (cyclomatic, cognitive load)
   - Code duplication and DRY principle adherence

4. Architecture Evaluation
   - Design pattern usage and appropriateness
   - Separation of concerns
   - Dependency management
   - Scalability considerations

5. Security Analysis
   - Input validation and sanitization
   - Authentication and authorization
   - Data encryption and protection
   - Common vulnerability patterns

6. DevOps & Infrastructure Review
   - CI/CD pipeline configuration
   - Infrastructure as Code (Terraform, Docker, Kubernetes)
   - Environment management and secrets handling
   - Observability (logging, metrics, tracing)
```

### Phase 3: Functional Validation
```
7. Requirements Traceability
   - Feature completeness
   - User story coverage
   - Acceptance criteria verification
   - Integration point validation

8. Performance Review
   - Algorithmic efficiency
   - Resource utilization
   - Caching strategies
   - Database query optimization

9. Testing Strategy
   - Test coverage analysis
   - Test quality and maintainability
   - Integration test completeness
   - Edge case coverage

10. Accessibility & Compliance
    - WCAG compliance for web/mobile applications
    - Screen reader compatibility
    - Keyboard navigation
    - Color contrast and ARIA labels
```

## Review Categories

### [CRITICAL] **Critical Issues** (Must Fix)
- Security vulnerabilities
- Functional bugs
- Performance blockers
- Architecture flaws

### [MAJOR] **Major Issues** (Should Fix)
- Code quality problems
- Missing documentation
- Suboptimal algorithms
- Integration issues

### [MINOR] **Minor Issues** (Nice to Fix)
- Code style inconsistencies
- Missing comments
- Minor performance improvements
- Documentation enhancements

### [SUGGESTION] **Suggestions** (Optional)
- Best practice improvements
- Future enhancement ideas
- Alternative approaches
- Learning opportunities

## Review Template

### Executive Summary
```
Overall Assessment: [Excellent/Good/Needs Improvement/Poor]
Critical Issues: [Number] 
Major Issues: [Number]
Minor Issues: [Number]
Estimated Fix Time: [Hours/Days/Weeks]
```

### Detailed Findings

#### 1. Code Quality
**Rating**: [1-10]
**Issues Found**:
- [Specific issue with line reference if applicable]
- [Another issue with context]

**Recommendations**:
- [Actionable improvement suggestion]
- [Specific code example or pattern]

#### 2. Architecture & Design
**Rating**: [1-10]
**Strengths**:
- [What works well]

**Areas for Improvement**:
- [Specific architectural concern]
- [Design pattern that could be better utilized]

#### 3. Security
**Rating**: [1-10]
**Vulnerabilities Identified**:
- [Security issue with severity level]
- [Potential risk with mitigation suggestion]

#### 4. Performance
**Rating**: [1-10]
**Bottlenecks Found**:
- [Performance issue with impact assessment]
- [Optimization opportunity with expected gain]

#### 5. Testing & Quality Assurance
**Rating**: [1-10]
**Coverage Analysis**:
- Unit Tests: [Percentage]% 
- Integration Tests: [Percentage]%
- End-to-End Tests: [Percentage]%

**Test Quality Issues**:
- [Specific test-related problem]

#### 6. Documentation
**Rating**: [1-10]
**Documentation Gaps**:
- [Missing or inadequate documentation area]
- [Unclear explanation or missing context]

## Specialized Review Checklists

### For Web Applications
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] Session management
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting implementation
- [ ] WCAG accessibility compliance
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] Color contrast and ARIA labels

### For Mobile Applications
- [ ] Secure data storage
- [ ] Network security (certificate pinning)
- [ ] Biometric authentication
- [ ] App sandboxing
- [ ] Sensitive data in logs
- [ ] Background data handling
- [ ] Platform-specific accessibility features
- [ ] Touch target sizing compliance

### For APIs
- [ ] Authentication mechanism
- [ ] Rate limiting
- [ ] Input validation schema
- [ ] Error handling consistency
- [ ] API versioning strategy
- [ ] Documentation completeness
- [ ] OpenAPI/Swagger specification

### For Databases
- [ ] Index optimization
- [ ] Query performance
- [ ] Data validation constraints
- [ ] Backup strategy
- [ ] Access control
- [ ] Data encryption
- [ ] Dependency health audit
- [ ] License compatibility check
- [ ] Known CVEs in dependencies

### For DevOps & Infrastructure
- [ ] CI/CD pipeline security
- [ ] Infrastructure as Code review
- [ ] Environment separation
- [ ] Secrets management
- [ ] Monitoring and alerting setup
- [ ] Disaster recovery procedures

## Review Guidelines

### Do's
- ✅ Provide specific, actionable feedback
- ✅ Reference line numbers or specific code sections
- ✅ Suggest concrete improvements with examples
- ✅ Consider the project context and constraints
- ✅ Balance criticism with recognition of good work
- ✅ Focus on high-impact issues first

### Don'ts
- ❌ Make vague, unactionable comments
- ❌ Focus only on minor style issues
- ❌ Ignore the project's purpose and constraints
- ❌ Be overly critical without constructive alternatives
- ❌ Assume knowledge not present in the codebase
- ❌ Focus on personal preferences over best practices

## Quality Metrics

### Code Quality Score (1-100)
- **Naming Conventions**: [0-20 points]
- **Code Organization**: [0-20 points]  
- **Complexity Management**: [0-20 points]
- **Documentation**: [0-20 points]
- **Error Handling**: [0-20 points]

### Security Score (1-100)
- **Authentication**: [0-25 points]
- **Authorization**: [0-25 points]
- **Data Protection**: [0-25 points]
- **Input Validation**: [0-25 points]

### Performance Score (1-100)
- **Algorithm Efficiency**: [0-30 points]
- **Resource Management**: [0-30 points]
- **Caching Strategy**: [0-20 points]
- **Monitoring**: [0-20 points]

## Review Completion Checklist
- [ ] All critical issues identified and documented
- [ ] Recommendations are specific and actionable
- [ ] Feedback is balanced and constructive
- [ ] Review covers all relevant aspects of the project
- [ ] Suggestions align with project goals and constraints
- [ ] Review provides clear next steps for improvement
- [ ] Accessibility compliance verified (where applicable)
- [ ] Dependency security and licensing reviewed
- [ ] DevOps and infrastructure components assessed
- [ ] Review scope matches project complexity and size

## Example Review Output

```
# Peer Review: [Project Name]

## Executive Summary
**Overall Assessment**: Good (7/10)
**Critical Issues**: 2
**Major Issues**: 5  
**Minor Issues**: 8
**Estimated Fix Time**: 2-3 days

## Critical Issues
1. **SQL Injection Vulnerability** (Line 156)
   - Unsanitized user input in database query
   - **Fix**: Use parameterized queries or ORM methods

2. **Missing Authentication** (API Endpoint /api/admin)
   - Sensitive endpoint accessible without authentication
   - **Fix**: Implement proper authentication middleware

## Major Issues
1. **Code Duplication** (Multiple files)
   - Repeated logic in user validation across modules
   - **Recommendation**: Extract to shared utility function

2. **Poor Error Handling** (Service layer)
   - Generic error messages that don't help debugging
   - **Recommendation**: Implement structured error handling with context

## Minor Issues
1. **Inconsistent Naming** (Line 42, 89, 134)
   - Mix of camelCase and snake_case in same module
   - **Fix**: Standardize on project naming convention

## Suggestions
1. **Consider implementing caching** for frequently accessed data
2. **Add comprehensive logging** for better observability
3. **Review test coverage** for critical business logic paths

## Next Steps
1. Address critical security issues immediately
2. Refactor duplicated code in next sprint
3. Implement structured error handling across all services
4. Schedule follow-up review after major issues resolved
```

## Quick Start Guide

### For Small Projects (<500 LOC)
Use the **Condensed Review Checklist**:
- [ ] Critical security issues
- [ ] Major functionality bugs
- [ ] Code organization and readability
- [ ] Basic documentation completeness
- [ ] Test coverage for critical paths

**Estimated Time**: 30-60 minutes

### For Medium Projects (500-5000 LOC)
Use the **Standard Review Process**:
- Complete all Phase 1 and Phase 2 sections
- Focus on architecture and security
- Review 20% of code samples for quality
- Assess test strategy and documentation

**Estimated Time**: 2-4 hours

### For Large Projects (>5000 LOC)
Use the **Comprehensive Review Process**:
- Complete all phases with team collaboration
- Focus on architecture, scalability, and security
- Review critical components in detail
- Assess DevOps practices and infrastructure
- Provide architectural recommendations

**Estimated Time**: 1-2 days

## Review Scope Guidelines

### By Project Type
- **Library/Package**: Focus on API design, documentation, and test coverage
- **Web Application**: Emphasize security, accessibility, and performance
- **Mobile App**: Prioritize platform compliance, security, and user experience
- **API Service**: Focus on contract design, security, and scalability
- **Infrastructure**: Emphasize security, monitoring, and disaster recovery

### By Development Stage
- **Prototype**: Focus on architecture and maintainability
- **Production**: Emphasize security, performance, and reliability
- **Legacy Migration**: Focus on technical debt and modernization strategy

## Pre-Review Checklist for Authors

Before requesting a review, authors should verify:
- [ ] All tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation is up to date
- [ ] Security considerations are documented
- [ ] Performance implications are considered
- [ ] Accessibility requirements are addressed (if applicable)

## Reviewer Best Practices

### Communication Guidelines
- Use clear, specific language
- Provide context for all feedback
- Suggest alternatives, don't just point out problems
- Acknowledge good practices and clever solutions
- Be respectful and professional

### Technical Depth
- Understand the project's domain and constraints
- Consider the trade-offs of suggested changes
- Focus on high-impact issues first
- Provide actionable, implementable feedback
- Document assumptions and reasoning

## Continuous Improvement

### Review Quality Metrics
Track these metrics to improve review effectiveness:
- **Issue Resolution Rate**: Percentage of issues actually fixed
- **Review Time**: Time from request to completion
- **Feedback Quality**: Author satisfaction with review helpfulness
- **Knowledge Transfer**: New insights gained by both reviewer and author

### Review Process Optimization
- Regularly update checklists based on common issues
- Share learnings from complex reviews
- Standardize terminology and severity definitions
- Provide training on new technologies and best practices

This master prompt ensures consistent, thorough, and valuable peer reviews that help improve code quality, security, and overall project excellence.
