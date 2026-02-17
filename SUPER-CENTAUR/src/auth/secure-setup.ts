import bcrypt from 'bcryptjs';
import { DataStore } from '../database/store';
import { Logger } from '../utils/logger';
import * as readline from 'readline';

export class SecureSetup {
  private logger: Logger;
  private store: DataStore;
  private rl: readline.Interface;

  constructor() {
    this.logger = new Logger('SecureSetup');
    this.store = DataStore.getInstance();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Interactive secure setup for initial admin user
   * This must be run manually to create the first admin user
   */
  public async initializeAdminUser(): Promise<void> {
    console.log('\n🛡️  SUPER CENTAUR - Secure Setup');
    console.log('=====================================');
    console.log('Creating initial admin user...\n');

    try {
      // Check if admin user already exists
      const existingUsers = this.store.list('users');
      if (existingUsers.length > 0) {
        console.log('❌ Admin user already exists. Setup complete.');
        return;
      }

      // Get admin credentials
      const username = await this.prompt('Enter admin username: ');
      const email = await this.prompt('Enter admin email: ');
      
      let password: string;
      let confirmPassword: string;
      
      do {
        password = await this.prompt('Enter admin password (min 12 chars): ', true);
        confirmPassword = await this.prompt('Confirm admin password: ', true);
        
        if (password !== confirmPassword) {
          console.log('❌ Passwords do not match. Please try again.');
        }
      } while (password !== confirmPassword);

      // Validate password strength
      if (!this.validatePassword(password)) {
        console.log('❌ Password must be at least 12 characters with uppercase, lowercase, number, and special character.');
        return;
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash(password, 12);
      const adminUser = this.store.insert('users', {
        username,
        email,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        mfaEnabled: false,
        securityQuestions: []
      });

      console.log('\n✅ Admin user created successfully!');
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log('\n🔒 Security Recommendations:');
      console.log('   - Enable MFA for this account');
      console.log('   - Set up security questions');
      console.log('   - Regularly rotate passwords');
      console.log('   - Monitor login activity');

    } catch (error) {
      this.logger.error('Failed to initialize admin user:', error);
      console.log('❌ Setup failed. Please try again.');
    } finally {
      this.rl.close();
    }
  }

  private validatePassword(password: string): boolean {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  private prompt(question: string, isPassword = false): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        if (isPassword) {
          // Clear the password from console (basic obfuscation)
          process.stdout.write('\x1b[1A\x1b[2K\r'); // Move cursor up and clear line
        }
        resolve(answer);
      });
    });
  }

  /**
   * Generate secure secrets for .env file
   */
  public generateSecrets(): void {
    console.log('\n🔑 Generating secure secrets...\n');
    
    const crypto = require('crypto');
    
    const secrets = {
      JWT_SECRET: crypto.randomBytes(64).toString('base64'),
      SESSION_SECRET: crypto.randomBytes(32).toString('base64'),
      ENCRYPTION_KEY: crypto.randomBytes(48).toString('base64'),
      API_KEY: crypto.randomBytes(32).toString('base64')
    };

    console.log('Generated secrets (copy to .env file):');
    console.log('=====================================');
    Object.entries(secrets).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });

    console.log('\n⚠️  IMPORTANT: Store these secrets securely and never commit them to version control!');
  }
}

// CLI interface
if (require.main === module) {
  const setup = new SecureSetup();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--generate-secrets')) {
    setup.generateSecrets();
  } else if (args.includes('--setup-admin')) {
    setup.initializeAdminUser();
  } else {
    console.log('🛡️  SUPER CENTAUR Secure Setup');
    console.log('=============================');
    console.log('Usage:');
    console.log('  node secure-setup.js --generate-secrets  # Generate secure secrets');
    console.log('  node secure-setup.js --setup-admin       # Initialize admin user');
    console.log('\n🔒 For production deployment, run both commands in order.');
  }
}

export default SecureSetup;