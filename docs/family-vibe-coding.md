# Family Vibe Coding

**Family vibe coding inside the game environment with internal slicing and push straight to printer**

## Overview

Family Vibe Coding enables families to code together in the game environment, slice 3D models internally, and push directly to printers. It includes parental controls, real-time collaboration, and a complete workflow from code to physical print.

## Features

### Family Collaboration 👨‍👩‍👧‍👦

- **Shared Coding Sessions** - Multiple family members code together
- **Real-Time Updates** - See code changes as they happen
- **Role-Based Permissions** - Parents, children, teens, adults have different permissions
- **Session Management** - Create, join, and manage family coding sessions

### Parental Controls 🛡️

- **Approval System** - Slice and print requests require parental approval for children/teens
- **Permission Management** - Control who can edit, execute, slice, and print
- **Safety First** - Built-in safety checks and approval workflows

### Complete Workflow 🔄

1. **Code** - Write code together in the game environment
2. **Execute** - Run code to build/modify structures
3. **Slice** - Slice 3D models internally
4. **Approve** - Parents approve slice/print requests
5. **Print** - Push directly to printer

## Usage

### Create Family Session

```typescript
const engine = new GameEngine();
await engine.init();

const familyVibeCoding = engine.getFamilyVibeCoding();

// Create session with host
const host: FamilyMember = {
  id: 'parent_1',
  name: 'The Operator',
  role: 'parent',
  permissions: {
    canEdit: true,
    canExecute: true,
    canSlice: true,
    canPrint: true
  }
};

const session = familyVibeCoding.createSession('Family Coding Night', host);
```

### Add Family Members

```typescript
// Add child
const child: FamilyMember = {
  id: 'child_1',
  name: 'Bash',
  role: 'child',
  permissions: {
    canEdit: true,
    canExecute: true,
    canSlice: true,  // Requires approval
    canPrint: true   // Requires approval
  }
};

familyVibeCoding.joinSession(session.id, child);

// Add another child
const willow: FamilyMember = {
  id: 'child_2',
  name: 'Willow',
  role: 'child',
  permissions: {
    canEdit: true,
    canExecute: true,
    canSlice: true,
    canPrint: true
  }
};

familyVibeCoding.joinSession(session.id, willow);
```

### Code Together

```typescript
// Update code (any member with edit permission)
familyVibeCoding.updateCode(session.id, 'child_1', `
  // Build a tetrahedron structure
  const game = engine.getGameEngine();
  for (let i = 0; i < 4; i++) {
    game.placePiece('tetrahedron', [i * 2, 0, 0]);
  }
`);

// Execute code (any member with execute permission)
const execution = await familyVibeCoding.executeCode(session.id, 'child_1');
```

### Slice and Print

```typescript
// Request slice (requires approval for children)
const structure = engine.getCurrentStructure();
const geometry = await engine.exportStructureToGeometry(structure);

const sliceJob = await familyVibeCoding.requestSlice(
  session.id,
  'child_1',
  geometry,
  { layerHeight: 0.2, infillDensity: 0.2 }
);

// Parent approves slice
if (sliceJob.status === 'pending') {
  await familyVibeCoding.approveSlice(sliceJob.id, 'parent_1');
}

// Request print (requires approval for children)
const printJob = await familyVibeCoding.requestPrint(
  session.id,
  'child_1',
  sliceJob.id
);

// Parent approves print
if (printJob.status === 'pending') {
  await familyVibeCoding.approvePrint(printJob.id, 'parent_1');
}
```

### Complete Workflow

```typescript
// One-step: Code → Execute → Slice → Print
const result = await familyVibeCoding.codeToPrint(
  session.id,
  'child_1',
  code,
  geometry,
  { layerHeight: 0.2 },
  'printer_1'
);

console.log('Complete!', result);
// { execution, sliceJob, printJob }
```

## Permissions

### Parent/Adult
- ✅ Can edit code
- ✅ Can execute code
- ✅ Can slice (no approval needed)
- ✅ Can print (no approval needed)
- ✅ Can approve slice/print requests

### Child/Teen
- ✅ Can edit code
- ✅ Can execute code
- ⚠️ Can request slice (requires approval)
- ⚠️ Can request print (requires approval)
- ❌ Cannot approve requests

## Events

```typescript
// Member joined
window.addEventListener('familyvibecoding:memberJoined', (e) => {
  console.log('Member joined:', e.detail.member);
});

// Code updated
window.addEventListener('familyvibecoding:codeUpdated', (e) => {
  console.log('Code updated by:', e.detail.memberId);
  // Update UI with new code
});

// Code executed
window.addEventListener('familyvibecoding:codeExecuted', (e) => {
  console.log('Code executed:', e.detail.execution);
});

// Slice requested
window.addEventListener('familyvibecoding:sliceRequested', (e) => {
  console.log('Slice requested by:', e.detail.member.name);
  // Show approval UI
});

// Slice approved
window.addEventListener('familyvibecoding:sliceApproved', (e) => {
  console.log('Slice approved:', e.detail.sliceJob);
});

// Print requested
window.addEventListener('familyvibecoding:printRequested', (e) => {
  console.log('Print requested by:', e.detail.member.name);
  // Show approval UI
});

// Print approved
window.addEventListener('familyvibecoding:printApproved', (e) => {
  console.log('Print approved:', e.detail.printJob);
});
```

## Integration with Game Engine

The family vibe coding system integrates with:

- **VibeCodingManager** - Code execution
- **SlicingEngine** - 3D model slicing
- **PrinterIntegration** - Direct printing
- **FamilyCoOpMode** - Family collaboration
- **SafetyManager** - Parental controls

## Example: Family Coding Night

```typescript
// 1. Parent creates session
const session = familyVibeCoding.createSession('Saturday Coding', parent);

// 2. Kids join
familyVibeCoding.joinSession(session.id, bash);
familyVibeCoding.joinSession(session.id, willow);

// 3. Kids code together
familyVibeCoding.updateCode(session.id, bash.id, `
  // Build a castle
  const game = engine.getGameEngine();
  for (let x = 0; x < 5; x++) {
    for (let z = 0; z < 5; z++) {
      game.placePiece('box', [x, 0, z]);
    }
  }
`);

// 4. Execute code
await familyVibeCoding.executeCode(session.id, bash.id);

// 5. Request slice (requires approval)
const sliceJob = await familyVibeCoding.requestSlice(
  session.id,
  bash.id,
  geometry
);

// 6. Parent approves
await familyVibeCoding.approveSlice(sliceJob.id, parent.id);

// 7. Request print (requires approval)
const printJob = await familyVibeCoding.requestPrint(
  session.id,
  bash.id,
  sliceJob.id
);

// 8. Parent approves
await familyVibeCoding.approvePrint(printJob.id, parent.id);

// 9. Printing starts!
```

## UI Components

- `FamilyVibeCodingPanel` - Main UI for family coding sessions
- Shows members, code editor, slice jobs, print jobs
- Approval interface for parents
- Real-time updates

## Safety Features

- **Parental Approval** - Required for children/teens
- **Permission Checks** - Enforced at every step
- **Session Management** - Host controls session
- **Audit Trail** - Track all actions

## Files Created

- `SUPER-CENTAUR/src/engine/family/FamilyVibeCodingManager.ts`
- `ui/src/components/FamilyVibeCoding/FamilyVibeCodingPanel.tsx`
- `docs/family-vibe-coding.md`

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

**Ready to build together. 💜**
