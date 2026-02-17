"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
var sqlite3_1 = require("sqlite3");
var util_1 = require("util");
var fs = require("fs");
var path = require("path");
// Create data directory if it doesn't exist
var dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
var dbPath = path.join(dataDir, 'super-centaur.db');
var db = new sqlite3_1.Database(dbPath);
var runAsync = (0, util_1.promisify)(db.run.bind(db));
var allAsync = (0, util_1.promisify)(db.all.bind(db));
function initDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, 12, 13]);
                    console.log('🔧 Initializing SUPER CENTAUR database...');
                    // Create tables
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        username TEXT UNIQUE NOT NULL,\n        email TEXT UNIQUE NOT NULL,\n        password_hash TEXT NOT NULL,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 1:
                    // Create tables
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS legal_cases (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        user_id INTEGER,\n        case_title TEXT NOT NULL,\n        case_type TEXT NOT NULL,\n        status TEXT DEFAULT 'active',\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        FOREIGN KEY (user_id) REFERENCES users (id)\n      )\n    ")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS medical_records (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        user_id INTEGER,\n        record_type TEXT NOT NULL,\n        description TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        FOREIGN KEY (user_id) REFERENCES users (id)\n      )\n    ")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS family_support (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        user_id INTEGER,\n        support_type TEXT NOT NULL,\n        details TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        FOREIGN KEY (user_id) REFERENCES users (id)\n      )\n    ")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS blockchain_transactions (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        user_id INTEGER,\n        transaction_hash TEXT,\n        transaction_type TEXT NOT NULL,\n        amount DECIMAL(18,8),\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        FOREIGN KEY (user_id) REFERENCES users (id)\n      )\n    ")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS system_logs (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        level TEXT NOT NULL,\n        message TEXT NOT NULL,\n        module TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS quantum_brain_data (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        neural_pattern TEXT,\n        processing_result TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS backups (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        backup_type TEXT NOT NULL,\n        backup_path TEXT NOT NULL,\n        status TEXT DEFAULT 'completed',\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n      CREATE TABLE IF NOT EXISTS monitoring_data (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        metric_name TEXT NOT NULL,\n        metric_value TEXT NOT NULL,\n        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 9:
                    _a.sent();
                    console.log('✅ Database tables created successfully!');
                    console.log("\uD83D\uDCC1 Database location: ".concat(dbPath));
                    return [4 /*yield*/, allAsync('SELECT 1 as test')];
                case 10:
                    result = _a.sent();
                    console.log('✅ Database connection test passed!');
                    return [3 /*break*/, 13];
                case 11:
                    error_1 = _a.sent();
                    console.error('❌ Database initialization failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 13];
                case 12:
                    db.close();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Run initialization if called directly
if (require.main === module) {
    initDatabase();
}
