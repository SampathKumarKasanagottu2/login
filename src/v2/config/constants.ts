import path from 'path';
import { config } from 'dotenv';
import { ProviderType } from '../providers/config/provider.config';

// Load environment variables
config();

/**
 * Encryption master key for AES-256-CBC
 * 32 bytes (64 hex characters) required for AES-256
 * TODO: Move to environment variables in Phase 2
 */
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

/**
 * Salt for encryption
 * TODO: Move to environment variables in Phase 2
 */
export const SALT = process.env.SALT || 'attendance_automation_salt_2025';

/**
 * Server configuration
 */
export const SERVER_PORT = parseInt(process.env.PORT || '7889', 10);

/**
 * Automation configuration
 * Controls the behavior of the attendance automation system
 */
export const AUTOMATION_CONFIG = {
    /** Cron schedule for automation (runs every minute) */
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || '* * * * *',
    /** Time window tolerance in minutes (±6 minutes from scheduled time) */
    TIME_WINDOW_MINUTES: parseInt(process.env.TIME_WINDOW_MINUTES || '6', 10),
    /** Extended retry window in hours after scheduled time (for recovery from failures) */
    EXTENDED_RETRY_HOURS: parseInt(process.env.EXTENDED_RETRY_HOURS || '2', 10),
    /** Emergency logout time - start attempting logout after this time (HH:MM format) */
    EMERGENCY_LOGOUT_START: process.env.EMERGENCY_LOGOUT_START || '22:00',
    /** Latest time to attempt logout before day ends (HH:MM format) */
    EMERGENCY_LOGOUT_END: process.env.EMERGENCY_LOGOUT_END || '23:59',
    /** Maximum number of retry attempts for failed executions */
    MAX_RETRY_ATTEMPTS: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3', 10),
    /** Delay in milliseconds between retry attempts */
    RETRY_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS || '5000', 10),
    /** Feature flag to enable/disable automation */
    ENABLE_AUTOMATION: process.env.ENABLE_AUTOMATION === 'true'
};

/**
 * Data storage configuration
 */
export const DATA_CONFIG = {
    /** Storage type: 'local' or 'cloud' */
    STORAGE_TYPE: process.env.DATA_STORAGE_TYPE || 'local',
    /** Data directory path */
    DATA_DIR: path.join(process.cwd(), 'data'),
    /** Users file path */
    USERS_FILE: path.join(process.cwd(), 'data', 'users.json'),
    /** Attendance logs file path */
    ATTENDANCE_LOGS_FILE: path.join(process.cwd(), 'data', 'attendance_logs.json')
};

/**
 * Provider configuration
 */
export const DEFAULT_PROVIDER = ProviderType.AKRIVIA;