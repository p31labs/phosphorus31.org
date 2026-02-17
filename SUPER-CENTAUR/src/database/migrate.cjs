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
exports.runMigrations = runMigrations;
var sqlite3_1 = require("sqlite3");
var util_1 = require("util");
var path = require("path");
var dbPath = path.join(__dirname, '../../data/super-centaur.db');
var db = new sqlite3_1.Database(dbPath);
var runAsync = (0, util_1.promisify)(db.run.bind(db));
var allAsync = (0, util_1.promisify)(db.all.bind(db));
function runMigrations() {
    return __awaiter(this, void 0, void 0, function () {
        var migrationsTable, index1Exists, hasAdditionalFields, hasPasswordReset, sessionsTable, auditTable, migrations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 30, 31, 32]);
                    console.log('🔄 Running SUPER CENTAUR database migrations...');
                    return [4 /*yield*/, allAsync("\n      SELECT name FROM sqlite_master \n      WHERE type='table' AND name='migrations'\n    ")];
                case 1:
                    migrationsTable = _a.sent();
                    if (!(migrationsTable.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, runAsync("\n        CREATE TABLE migrations (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          migration_name TEXT NOT NULL UNIQUE,\n          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP\n        )\n      ")];
                case 2:
                    _a.sent();
                    console.log('✅ Migrations table created');
                    _a.label = 3;
                case 3: return [4 /*yield*/, allAsync("\n      SELECT name FROM sqlite_master \n      WHERE type='index' AND name='idx_users_email'\n    ")];
                case 4:
                    index1Exists = _a.sent();
                    if (!(index1Exists.length === 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_users_email ON users(email)')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_users_username ON users(username)')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_legal_cases_user_id ON legal_cases(user_id)')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_medical_records_user_id ON medical_records(user_id)')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_family_support_user_id ON family_support(user_id)')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_blockchain_transactions_user_id ON blockchain_transactions(user_id)')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_system_logs_timestamp ON system_logs(created_at)')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, runAsync('CREATE INDEX idx_monitoring_data_timestamp ON monitoring_data(timestamp)')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        INSERT INTO migrations (migration_name) \n        VALUES ('add_performance_indexes')\n      ")];
                case 13:
                    _a.sent();
                    console.log('✅ Performance indexes migration completed');
                    _a.label = 14;
                case 14: return [4 /*yield*/, allAsync("\n      PRAGMA table_info(users)\n    ")];
                case 15:
                    hasAdditionalFields = _a.sent();
                    hasPasswordReset = hasAdditionalFields.some(function (col) { return col.name === 'password_reset_token'; });
                    if (!!hasPasswordReset) return [3 /*break*/, 20];
                    return [4 /*yield*/, runAsync("\n        ALTER TABLE users ADD COLUMN password_reset_token TEXT\n      ")];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        ALTER TABLE users ADD COLUMN password_reset_expires DATETIME\n      ")];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0\n      ")];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        INSERT INTO migrations (migration_name) \n        VALUES ('add_user_security_fields')\n      ")];
                case 19:
                    _a.sent();
                    console.log('✅ User security fields migration completed');
                    _a.label = 20;
                case 20: return [4 /*yield*/, allAsync("\n      SELECT name FROM sqlite_master \n      WHERE type='table' AND name='sessions'\n    ")];
                case 21:
                    sessionsTable = _a.sent();
                    if (!(sessionsTable.length === 0)) return [3 /*break*/, 24];
                    return [4 /*yield*/, runAsync("\n        CREATE TABLE sessions (\n          id TEXT PRIMARY KEY,\n          user_id INTEGER,\n          expires_at DATETIME NOT NULL,\n          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          FOREIGN KEY (user_id) REFERENCES users (id)\n        )\n      ")];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        INSERT INTO migrations (migration_name) \n        VALUES ('add_sessions_table')\n      ")];
                case 23:
                    _a.sent();
                    console.log('✅ Sessions table migration completed');
                    _a.label = 24;
                case 24: return [4 /*yield*/, allAsync("\n      SELECT name FROM sqlite_master \n      WHERE type='table' AND name='audit_log'\n    ")];
                case 25:
                    auditTable = _a.sent();
                    if (!(auditTable.length === 0)) return [3 /*break*/, 28];
                    return [4 /*yield*/, runAsync("\n        CREATE TABLE audit_log (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          user_id INTEGER,\n          action TEXT NOT NULL,\n          entity_type TEXT,\n          entity_id INTEGER,\n          old_values TEXT,\n          new_values TEXT,\n          ip_address TEXT,\n          user_agent TEXT,\n          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n          FOREIGN KEY (user_id) REFERENCES users (id)\n        )\n      ")];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, runAsync("\n        INSERT INTO migrations (migration_name) \n        VALUES ('add_audit_log_table')\n      ")];
                case 27:
                    _a.sent();
                    console.log('✅ Audit log table migration completed');
                    _a.label = 28;
                case 28: return [4 /*yield*/, allAsync('SELECT * FROM migrations ORDER BY executed_at')];
                case 29:
                    migrations = _a.sent();
                    console.log('📊 Migration status:');
                    migrations.forEach(function (migration) {
                        console.log("  \u2705 ".concat(migration.migration_name, " - ").concat(migration.executed_at));
                    });
                    console.log('🎉 All migrations completed successfully!');
                    return [3 /*break*/, 32];
                case 30:
                    error_1 = _a.sent();
                    console.error('❌ Migration failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 32];
                case 31:
                    db.close();
                    return [7 /*endfinally*/];
                case 32: return [2 /*return*/];
            }
        });
    });
}
// Run migrations if called directly
if (require.main === module) {
    runMigrations();
}
