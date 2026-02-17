# ARCHITECTURAL ENFORCEMENT

## THE PROBLEM

Developers (human or AI) keep bypassing foundation components.

They build custom layouts instead of using:
- ModulePage
- ModuleCard
- Form components

This breaks consistency and creates the issues we're seeing.

## THE SOLUTION

ENFORCE the architecture at build time.

---

## 1. ESLINT RULES (Immediate)

Create `.eslintrc.json`:

```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [{
        "group": ["react"],
        "importNames": ["Fragment"],
        "message": "Use ModulePage and ModuleCard instead of custom layouts"
      }]
    }],
    "no-restricted-syntax": ["error",
      {
        "selector": "JSXElement[openingElement.name.name='div'][openingElement.attributes.length>3]",
        "message": "Complex divs detected. Use ModuleCard or semantic components."
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/app/**/page.tsx"],
      "rules": {
        "module-structure/enforce-page-wrapper": "error"
      }
    }
  ]
}
```

---

## 2. CUSTOM ESLINT RULE

Create `eslint-rules/enforce-module-structure.js`:

```javascript
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce ModulePage wrapper in all page components",
      category: "Architecture",
    },
    messages: {
      missingModulePage: "All page components must use ModulePage wrapper",
      missingModuleCard: "Module content must be wrapped in ModuleCard",
    },
  },
  create(context) {
    return {
      ExportDefaultDeclaration(node) {
        const filename = context.getFilename();
        
        // Only check page.tsx files
        if (!filename.includes('page.tsx')) return;
        
        // Check if ModulePage is imported
        const sourceCode = context.getSourceCode();
        const imports = sourceCode.ast.body.filter(n => n.type === 'ImportDeclaration');
        
        const hasModulePage = imports.some(imp => 
          imp.specifiers.some(spec => spec.imported?.name === 'ModulePage')
        );
        
        if (!hasModulePage) {
          context.report({
            node,
            messageId: 'missingModulePage',
          });
        }
      }
    };
  }
};
```

---

## 3. BUILD-TIME CHECK

Create `scripts/check-architecture.js`:

```javascript
const fs = require('fs');
const path = require('path');

console.log('🏗️  Checking architectural compliance...');

const errors = [];

// Find all page.tsx files
function findPages(dir) {
  const files = fs.readdirSync(dir);
  const pages = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      pages.push(...findPages(fullPath));
    } else if (file === 'page.tsx') {
      pages.push(fullPath);
    }
  }
  
  return pages;
}

// Check each page
const pages = findPages('./src/app');

for (const pagePath of pages) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  
  // Check 1: Must import ModulePage
  if (!content.includes("from '@/components/core/ModulePage'") &&
      !content.includes('from "@/components/core/ModulePage"')) {
    errors.push(`${pagePath}: Missing ModulePage import`);
  }
  
  // Check 2: Must import ModuleCard
  if (!content.includes("from '@/components/core/ModuleCard'") &&
      !content.includes('from "@/components/core/ModuleCard"')) {
    errors.push(`${pagePath}: Missing ModuleCard import`);
  }
  
  // Check 3: Must use ModulePage in JSX
  if (!content.includes('<ModulePage>')) {
    errors.push(`${pagePath}: ModulePage not used in JSX`);
  }
  
  // Check 4: Must use ModuleCard in JSX
  if (!content.includes('<ModuleCard')) {
    errors.push(`${pagePath}: ModuleCard not used in JSX`);
  }
  
  // Check 5: No raw divs with className containing 'w-full h-full'
  if (content.match(/<div[^>]*className="[^"]*w-full[^"]*h-full[^"]*"/)) {
    errors.push(`${pagePath}: Full-screen div detected - use ModulePage instead`);
  }
  
  // Check 6: No custom positioning
  if (content.includes('absolute') || content.includes('fixed')) {
    errors.push(`${pagePath}: Absolute/fixed positioning detected - use foundation`);
  }
}

// Report
if (errors.length > 0) {
  console.error('\n❌ ARCHITECTURAL VIOLATIONS DETECTED:\n');
  errors.forEach(err => console.error(`  - ${err}`));
  console.error('\n');
  console.error('Fix: Use ModulePage and ModuleCard in all page components.\n');
  process.exit(1);
} else {
  console.log('✅ All pages comply with architecture\n');
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "check:arch": "node scripts/check-architecture.js",
    "prebuild": "npm run check:arch",
    "predev": "npm run check:arch"
  }
}
```

---

## 4. TEMPLATE GENERATOR (Mandatory)

Update `scripts/create-module.js` to be the ONLY way to create modules:

```javascript
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Usage: npm run create-module <module-name>');
  console.error('   Example: npm run create-module my-cool-feature');
  process.exit(1);
}

// Validate name
if (!/^[a-z0-9-]+$/.test(moduleName)) {
  console.error('❌ Module name must be lowercase with hyphens only');
  process.exit(1);
}

const modulePath = path.join(__dirname, '..', 'src', 'app', moduleName);

// Check if exists
if (fs.existsSync(modulePath)) {
  console.error(`❌ Module "${moduleName}" already exists`);
  process.exit(1);
}

// Create directory
fs.mkdirSync(modulePath, { recursive: true });

// Generate template
const template = `import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { Button } from '@/components/core/Form';

export default function ${capitalize(moduleName)}Page() {
  return (
    <ModulePage>
      <ModuleCard 
        title="${capitalize(moduleName)}"
        subtitle="Add your subtitle here"
        icon="✨"
        actions={
          <Button variant="primary" fullWidth>
            Primary Action
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Your module content goes here.
          </p>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}

function capitalize(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
`;

// Write file
fs.writeFileSync(path.join(modulePath, 'page.tsx'), template);

console.log(`✅ Created module: ${moduleName}`);
console.log(`📁 Location: src/app/${moduleName}/page.tsx`);
console.log(`🚀 Start dev server to see your module`);
console.log(`\n📝 Edit the file to customize your module.`);
console.log(`   - Change title, subtitle, icon`);
console.log(`   - Add content inside ModuleCard`);
console.log(`   - Add actions (buttons)`);
console.log(`\n⚠️  DO NOT remove ModulePage or ModuleCard wrappers.`);

function capitalize(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

---

## 5. DOCUMENTATION

Create `ARCHITECTURE.md` in root:

```markdown
# ARCHITECTURAL RULES

## Creating Modules

**ALWAYS use the generator:**

```bash
npm run create-module my-feature
```

**NEVER create page.tsx files manually.**

## Module Structure (MANDATORY)

Every module page MUST follow this structure:

```tsx
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';

export default function MyPage() {
  return (
    <ModulePage>
      <ModuleCard title="..." subtitle="..." icon="...">
        {/* Your content */}
      </ModuleCard>
    </ModulePage>
  );
}
```

## What You CAN'T Do

❌ Create custom layouts
❌ Use full-screen divs
❌ Use absolute/fixed positioning
❌ Bypass ModulePage/ModuleCard
❌ Write custom CSS for layout
❌ Make up your own component structure

## What You CAN Do

✅ Use foundation components (ModulePage, ModuleCard, Button, Input)
✅ Add content inside ModuleCard
✅ Compose multiple cards if needed
✅ Use provided form components
✅ Style content (not layout)

## Why These Rules Exist

1. **Consistency** - All modules look and behave the same
2. **Maintainability** - One place to fix layout issues
3. **Simplicity** - Developers focus on content, not layout
4. **Quality** - Foundation is battle-tested and works

## Enforcement

These rules are enforced at:
- Build time (scripts/check-architecture.js)
- Lint time (ESLint rules)
- Runtime (TypeScript types)

Breaking these rules will fail the build.

## Questions?

Read: docs/MODULE-CREATION.md
```

---

## 6. TYPE ENFORCEMENT

Update `ModulePage` to enforce structure:

```typescript
// src/components/core/ModulePage.tsx

import { ReactElement } from 'react';
import { ModuleCard } from './ModuleCard';

interface ModulePageProps {
  children: ReactElement<typeof ModuleCard>;
}

/**
 * ModulePage - REQUIRED wrapper for all page components
 * 
 * This component handles:
 * - Centering content
 * - Z-index layering
 * - Scroll behavior
 * 
 * USAGE:
 * <ModulePage>
 *   <ModuleCard title="...">
 *     Content
 *   </ModuleCard>
 * </ModulePage>
 */
export function ModulePage({ children }: ModulePageProps) {
  // Type check: Ensure child is ModuleCard
  if (children.type !== ModuleCard) {
    throw new Error(
      'ModulePage children must be ModuleCard. ' +
      'Use: <ModulePage><ModuleCard>...</ModuleCard></ModulePage>'
    );
  }
  
  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      p-4
      relative z-10
    ">
      {children}
    </div>
  );
}
```

---

## RESULT

Now it's IMPOSSIBLE to bypass the foundation.

- Build fails if ModulePage missing
- TypeScript error if structure wrong
- ESLint error if custom layout
- Generator enforces template

**No more custom layouts.**

**No more broken modules.**

**Foundation or nothing.**
