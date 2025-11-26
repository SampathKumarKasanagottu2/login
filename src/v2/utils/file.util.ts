import fs from 'fs/promises';
import path from 'path';
import { DATA_CONFIG } from '../config/constants';
import { User } from '../models/user.model';

/**
 * Ensures the users.json file exists
 * Creates the file with an empty array if it doesn't exist
 * @throws Error if directory creation or file creation fails
 */
export async function ensureFileExists(): Promise<void> {
    try {
        // Check if file exists
        try {
            await fs.access(DATA_CONFIG.USERS_FILE);
            // File exists, do nothing
            return;
        } catch {
            // File doesn't exist, create it
        }

        // Ensure parent directory exists
        const dirPath = path.dirname(DATA_CONFIG.USERS_FILE);
        await fs.mkdir(dirPath, { recursive: true });

        // Create file with empty array
        await fs.writeFile(DATA_CONFIG.USERS_FILE, '[]', 'utf8');
    } catch (error) {
        throw new Error(`Failed to ensure file exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Reads all users from the JSON file
 * @returns Array of users
 * @throws Error if file read or JSON parse fails
 */
export async function readUsersFromFile(): Promise<User[]> {
    try {
        // Ensure file exists first
        await ensureFileExists();

        // Read file content
        const fileContent = await fs.readFile(DATA_CONFIG.USERS_FILE, 'utf8');

        // Parse JSON
        const users = JSON.parse(fileContent);

        // Validate it's an array
        if (!Array.isArray(users)) {
            throw new Error('Invalid users file format: expected array');
        }

        return users;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON in users file');
        }
        throw new Error(`Failed to read users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Writes users array to the JSON file
 * Uses atomic write (write to temp file, then rename) to prevent corruption
 * @param users - Array of users to write
 * @throws Error if file write fails
 */
export async function writeUsersToFile(users: User[]): Promise<void> {
    try {
        // Ensure directory exists
        const dirPath = path.dirname(DATA_CONFIG.USERS_FILE);
        await fs.mkdir(dirPath, { recursive: true });

        // Convert to JSON with pretty formatting
        const jsonContent = JSON.stringify(users, null, 2);

        // Atomic write: write to temp file first
        const tempFilePath = `${DATA_CONFIG.USERS_FILE}.tmp`;
        await fs.writeFile(tempFilePath, jsonContent, 'utf8');

        // Rename temp file to actual file (atomic operation)
        await fs.rename(tempFilePath, DATA_CONFIG.USERS_FILE);
    } catch (error) {
        throw new Error(`Failed to write users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
