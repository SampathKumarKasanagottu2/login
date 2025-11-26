#!/usr/bin/env node

/**
 * Key Generation Utility
 *
 * Generates secure encryption keys for the attendance automation system.
 * Run this to get cryptographically secure keys for your .env file.
 */

const crypto = require('crypto');

// Generate 32-byte (256-bit) key for AES-256
const encryptionKey = crypto.randomBytes(32).toString('hex');

// Generate a secure salt
const salt = crypto.randomBytes(16).toString('hex');

console.log('🔐 Generated secure keys for attendance automation:');
console.log('');
console.log('Add these to your .env file:');
console.log('');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(`SALT=${salt}`);
console.log('');
console.log('⚠️  Keep these keys secure and never commit them to version control!');
console.log('   Store them safely in your cloud platform\'s environment variables.');