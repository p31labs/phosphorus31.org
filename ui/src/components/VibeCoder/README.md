# VibeCoder

**Code editor inside the game environment with internal slicing and push straight to printer**

Built with love and light. As above, so below. 💜  
The Mesh Holds. 🔺

## Features

### 🔪 Internal Slicing
- **Automatic Code Slicing**: Detects functions, classes, and code blocks
- **Visual Slice Panel**: See all slices in a side panel
- **Slice Selection**: Click a slice to highlight it in the editor
- **Context Information**: Each slice shows line numbers and context

### 🖨️ Push to Printer
- **One-Click Printing**: Push selected slice or entire code to printer
- **Printer Queue**: See all print jobs with status tracking
- **Status Indicators**: Queued, Printing, Complete, Error states
- **Code Validation**: Validates code before printing

### 💻 Code Editor
- **Syntax Highlighting**: Monospace editor with line numbers
- **Real-time Updates**: Auto-slices code as you type
- **Full Screen Mode**: Immersive coding experience
- **Dark Theme**: Easy on the eyes

## Usage

1. **Open VibeCoder**: Click the "💻 VibeCoder" button in The Scope
2. **Write Code**: Type your code in the editor
3. **View Slices**: See automatically generated slices in the side panel
4. **Select Slice**: Click a slice to highlight it in the editor
5. **Push to Printer**: Click "🖨️ Push to Printer" to compile/deploy

## Slicing Algorithm

The internal slicing engine detects:
- Function declarations (`function`, `const`, `let`, `var`)
- Class declarations (`class`, `interface`)
- Export statements (`export`)
- Code blocks (by brace matching)

Each slice includes:
- Start and end line numbers
- Full content
- Context description

## Printer Integration

The printer system:
- Validates code syntax
- Queues print jobs
- Tracks job status
- Outputs to console (can be extended to actual compilation/deployment)

## Future Enhancements

- [ ] TypeScript compilation
- [ ] Actual deployment integration
- [ ] Code formatting (Prettier)
- [ ] Syntax highlighting (Monaco Editor)
- [ ] Multi-file support
- [ ] Version control integration
- [ ] Real printer output (PDF, paper)

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜

*Vibe coding inside the game. Internal slicing. Push straight to printer.*
