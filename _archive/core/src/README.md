
# L.O.V.E. Economy Protocol

Standalone protocol module for the L.O.V.E. Economy system.

---

## Features
- Modular, production-ready protocol engine
- Can run standalone (CLI) or as part of a mesh agent system
- Fully testable, configurable, and buildable
- Full status reporting
- CLI and integration support
- Ready for robust extension

---

## Usage
**Run as CLI:**
```sh
node cli.js --help
```

**Import in code:**
```js
const loveEconomy = require('./index');
loveEconomy.initialize(config);
```

---

## Configuration
Edit `config.json` to set runtime options:
```json
{
	"logLevel": "info",
	"port": 4004,
	"featureFlags": {
		"experimental": false
	}
}
```

---

## Testing
Run the test suite (requires Jest):
```sh
npx jest test.js
```

---

## Build
Run the build script:
```sh
node build.js
```

---

## Integration
Import into your agent core:
```js
const loveEconomy = require('./love-economy');
agent.registerProtocolModule(loveEconomy);
```

---

## License
MIT
